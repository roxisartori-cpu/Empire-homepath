export const matchPrograms = (programs, userData) => {
  const {
    county = "",
    income = 0,
    purchasePrice = 0,
    isFirstTimeBuyer = false,
    householdSize = 1,
    isVeteran = false,
    propertyType = "single-family"
  } = userData;

  return programs.map(program => {
    let score = 100;
    let reasons = [];

    // 1. County & City Filter
    if (program.counties_served !== "All 62 counties in New York State") {
      const userCounty = county.toLowerCase();
      const userCity = (userData.city || "").toLowerCase();

      // Check for structured municipality data first
      if (program.municipality) {
        const m = program.municipality;
        if (m.county.toLowerCase() !== userCounty) {
          score -= 100;
        } else if (m.city && userCity && m.city.toLowerCase() !== userCity) {
          score -= 80; // In same county, but different city
        } else if (m.city && !userCity) {
          score -= 20; // City-specific program but city not provided
        }
      } else {
        // Fallback to string-based matching
        const servedStr = (program.counties_served || "").toLowerCase();
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
          // County matches, check for municipal restrictions in string
          if (servedStr.includes("only") || servedStr.includes("city of")) {
            if (userCity && servedStr.includes(userCity)) {
              score += 10; // Boost for specific city match
            } else if (userCity) {
              score -= 50; 
            } else {
              score -= 20;
            }
          }
        }
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
      
      // If structured municipality exists, check its county first
      if (program.municipality) {
          // Some municipal programs have income limits as direct keys (1_person, etc.)
          if (incomeLimits["1_person"] || incomeLimits["1-2_persons"]) {
              const limits = incomeLimits;
              if (householdSize <= 2 && (limits["1-2_persons"] || (householdSize === 1 ? limits["1_person"] : limits["2_persons"]))) {
                  countyLimit = limits["1-2_persons"] || (householdSize === 1 ? limits["1_person"] : limits["2_persons"]);
              } else if (householdSize >= 3 && limits["3+_persons"]) {
                  countyLimit = limits["3+_persons"];
              } else {
                  countyLimit = limits[`${householdSize}_person`] || limits[`${householdSize}_persons`];
              }
          }
      }
      
      // Fallback or standard state program lookup
      if (!countyLimit) {
        const countyKey = Object.keys(incomeLimits).find(k => k.toLowerCase().includes(county.toLowerCase()));
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
      const countyKey = Object.keys(priceLimits).find(k => k.toLowerCase().includes(county.toLowerCase()));
      const countyPriceLimit = countyKey ? priceLimits[countyKey] : null;
      
      if (countyPriceLimit && typeof countyPriceLimit === 'number') {
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
