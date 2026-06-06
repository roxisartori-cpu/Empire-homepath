export const matchPrograms = (programs, userData) => {
  const {
    county,
    income,
    householdSize,
    purchasePrice,
    propertyType,
    isFirstTimeBuyer,
    isVeteran
  } = userData;

  return programs.map(program => {
    let score = 100;
    let reasons = [];

    // 1. County & City Filter
    if (program.counties_served && program.counties_served !== "All 62 counties in New York State") {
      const servedStr = program.counties_served.toLowerCase();
      const userCounty = county.toLowerCase();
      const userCity = (userData.city || "").toLowerCase();

      // Check if county matches
      if (!servedStr.includes(userCounty)) {
        // Special case for CHI and RUPCO (existing logic)
        if (program.program_name === "Community Housing Innovations (CHI) Grant") {
           const chiCounties = ["westchester", "dutchess", "nassau", "suffolk", "orange", "putnam", "rockland", "sullivan", "ulster"];
           if (!chiCounties.includes(userCounty)) score -= 100;
        } else if (program.program_name === "RUPCO First-Time Homebuyer Assistance") {
           const rupcoCounties = ["ulster", "sullivan", "orange"];
           if (!rupcoCounties.includes(userCounty)) score -= 100;
        } else {
           score -= 100;
        }
      } else {
        // County matches, check for municipal restrictions
        if (servedStr.includes("only") || servedStr.includes("city of")) {
          if (userCity && servedStr.includes(userCity)) {
            score += 10; // Boost for specific city match
          } else if (userCity) {
            score -= 50; // User in same county but different city? Maybe match lower
          } else {
            score -= 20; // User didn't specify city for a city-only program
          }
        }
      }
    } else if (program.municipality) {
      // Municipal program match logic
      const userCounty = county.toLowerCase();
      const userCity = (userData.city || "").toLowerCase();
      const progCounty = program.municipality.county.toLowerCase();
      const progCity = (program.municipality.city || "").toLowerCase();

      if (userCounty !== progCounty) {
        score -= 100;
      } else if (progCity && userCity !== progCity) {
        score -= 80; // County match but city mismatch for city program
      } else if (progCity && !userCity) {
        score -= 20; // County match but city not specified
      }
    }

    // 2. First Time Buyer Filter
    if (!isFirstTimeBuyer) {
        if (program.program_name.toLowerCase().includes("first-time") || 
            program.description.toLowerCase().includes("first-time")) {
            score -= 100;
        }
    }

    // 3. Income Limit Filter
    const incomeLimits = program.income_limits;
    if (typeof incomeLimits === 'object' && incomeLimits !== null) {
      let countyLimit = null;
      const countyKey = Object.keys(incomeLimits).find(k => k.includes(county));
      if (countyKey) {
        const limits = incomeLimits[countyKey];
        if (typeof limits === 'object') {
          if (householdSize <= 2 && limits["1-2_persons"]) {
            countyLimit = limits["1-2_persons"];
          } else if (householdSize >= 3 && limits["3+_persons"]) {
            countyLimit = limits["3+_persons"];
          } else if (limits[`${householdSize}_person`] || limits[`${householdSize}_persons`]) {
            countyLimit = limits[`${householdSize}_person`] || limits[`${householdSize}_persons`];
          } else if (householdSize > 4 && (limits["4_persons"] || limits["4_person"])) {
             countyLimit = (limits["4_persons"] || limits["4_person"]) * 1.1;
          }
        }
      }
      
      if (countyLimit) {
        if (income > countyLimit) {
          score -= 100;
        } else if (income > countyLimit * 0.9) {
          score -= 10; // Close to limit
        }
      }
    }

    // 4. Purchase Price Filter
    const priceLimits = program.purchase_price_limits;
    if (typeof priceLimits === 'object' && priceLimits !== null) {
        const countyPriceLimit = priceLimits[county];
        if (countyPriceLimit) {
          if (purchasePrice > countyPriceLimit) {
            score -= 100;
          } else if (purchasePrice > countyPriceLimit * 0.9) {
            score -= 10;
          }
        }
    }

    // Determine match strength
    let matchStrength = "Maybe";
    if (score >= 95) matchStrength = "Strong";
    else if (score >= 70) matchStrength = "Good";

    return {
      ...program,
      score,
      matchStrength,
      eligible: score > 0
    };
  }).filter(p => p.eligible).sort((a, b) => b.score - a.score);
};
