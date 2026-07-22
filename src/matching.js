export const matchPrograms = (programs, userData) => {
  const {
    county,
    city,
    income,
    householdSize,
    purchasePrice,
    propertyType,
    isFirstTimeBuyer,
    isVeteran,
    isInterestedInRenovation,
    isInterestedInEnergy,
    isInterestedInAccessibility
  } = userData;

  return programs.map(program => {
    let score = 100;
    
    const category = program.category || "";
    const name = (program.program_name || "").toLowerCase();
    const desc = (program.description || "").toLowerCase();

    // 1. County & City Filter
    if (name.includes("home headquarters")) {
      // Statewide except NYC's 5 boroughs. Handled as its own unconditional
      // check (rather than inside the servedStr substring logic below)
      // because "New York" the county collides with "New York State" and
      // "New York City" as substrings of the description text, which would
      // otherwise falsely mark this as already matching for that county.
      const userCounty = (county || "").toLowerCase();
      const nycCounties = ["bronx", "kings", "new york", "queens", "richmond"];
      if (nycCounties.includes(userCounty)) score -= 100;
    } else if (program.counties_served && program.counties_served !== "All 62 counties in New York State") {
      const servedStr = program.counties_served.toLowerCase();
      const userCounty = (county || "").toLowerCase();
      const userCity = (city || "").toLowerCase();

      // Check if county matches
      if (!servedStr.includes(userCounty)) {
        // Special case for CHI and RUPCO
        if (name.includes("community housing innovations") || name.includes("chi grant")) {
           const chiCounties = ["westchester", "dutchess", "nassau", "suffolk"];
           if (!chiCounties.includes(userCounty)) score -= 100;
        } else if (name.includes("rupco")) {
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
            score -= 50; // User in same county but different city? Match lower
          } else {
            score -= 20; // User didn't specify city for a city-only program
          }
        }
      }
    } else if (program.municipality) {
      // Municipal program match logic
      const userCounty = (county || "").toLowerCase();
      const userCity = (city || "").toLowerCase();
      const progCounty = (program.municipality.county || "").toLowerCase();
      const progCity = (program.municipality.city || "").toLowerCase();

      if (!progCounty.includes(userCounty) && !userCounty.includes(progCounty)) {
        score -= 100;
      } else if (progCity && userCity !== progCity) {
        score -= 80; // County match but city mismatch for city program
      } else if (progCity && !userCity) {
        score -= 20; // County match but city not specified
      }
    }

    // 2. First Time Buyer Filter
    if (!isFirstTimeBuyer) {
        if (name.includes("first-time") || desc.includes("first-time")) {
            score -= 100;
        } else if (category === "First-Time Buyer") {
            score -= 100;
        }
    }

    // 3. Category Specific Logic
    if (category === "Veterans") {
        if (isVeteran) {
            score += 20;
        } else {
            score -= 100;
        }
    }

    if (category === "Renovation") {
        if (isInterestedInRenovation) {
            score += 30;
        } else {
            score -= 20;
        }
    }

    if (category === "Energy Efficiency") {
        if (isInterestedInEnergy) {
            score += 30;
        } else {
            score -= 20;
        }
    }

    if (category === "Accessibility") {
        if (isInterestedInAccessibility) {
            score += 40;
        } else {
            score -= 60;
        }
    }

    if (category === "USDA / Rural") {
        const urbanCounties = ["new york", "kings", "queens", "bronx", "richmond", "erie", "monroe", "albany", "onondaga", "westchester", "nassau", "suffolk"];
        if (urbanCounties.includes((county || "").toLowerCase())) {
            score -= 100;
        } else {
            score += 10;
        }
    }

    // 4. Income Limit Filter
    const incomeLimits = program.income_limits;
    if (typeof incomeLimits === 'object' && incomeLimits !== null) {
      let countyLimit = null;
      const userCounty = (county || "").toLowerCase();
      const countyKey = Object.keys(incomeLimits).find(k => k.toLowerCase().includes(userCounty));
      
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
             // Scale beyond 4 persons (8% per additional person is a common housing guideline)
             const baseLimit = limits["4_persons"] || limits["4_person"];
             countyLimit = baseLimit * (1 + (householdSize - 4) * 0.08);
          }
        }
      } else if (incomeLimits["1_person"]) {
          if (incomeLimits[`${householdSize}_person`] || incomeLimits[`${householdSize}_persons`]) {
              countyLimit = incomeLimits[`${householdSize}_person`] || incomeLimits[`${householdSize}_persons`];
          }
      }
      
      if (countyLimit) {
        if (income > countyLimit) {
          score -= 100;
        } else if (income > countyLimit * 0.9) {
          score -= 10;
        }
      }
    }

    // 5. Purchase Price Filter
    const priceLimits = program.purchase_price_limits;
    if (typeof priceLimits === 'object' && priceLimits !== null) {
        const userCounty = (county || "").toLowerCase();
        const countyKey = Object.keys(priceLimits).find(k => k.toLowerCase().includes(userCounty));
        
        if (countyKey) {
            const limits = priceLimits[countyKey];
            let priceLimit = null;
            
            if (typeof limits === 'object') {
                if (propertyType === 'Single Family' && limits["1-family"]) priceLimit = limits["1-family"];
                else if (propertyType === '2-4 Unit' && limits["2-family"]) priceLimit = limits["2-family"];
                else if (limits["1-family"]) priceLimit = limits["1-family"];
            } else {
                priceLimit = limits;
            }

            if (priceLimit && purchasePrice > priceLimit) {
                score -= 100;
            } else if (priceLimit && purchasePrice > priceLimit * 0.9) {
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
