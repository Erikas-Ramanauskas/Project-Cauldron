"use strict";


//  find potion by id and return its stats 
function findPotionStats(id) {
    for (let i = 0; i < potions.length; i++) {
        if (potions[i].id === id) {
            return potions[i];
        }
    }
}


// function updates players html stats
function playerStatsUpdate(strength, agility, dexterity, vitality) {
    const addedStrength = strength == "?" ? 0 : Number(strength);
    const addedAgility = agility == "?" ? 0 : Number(agility);
    const addedDexterity = dexterity == "?" ? 0 : Number(dexterity);
    const addedVitality = Number(vitality);
    
    playerStats.strength + addedStrength < 0 ? playerStats.strength = 0 : playerStats.strength += addedStrength;
    playerStats.agility + addedAgility < 0 ? playerStats.agility = 0 : playerStats.agility += addedAgility;
    playerStats.dexterity + addedDexterity < 0 ? playerStats.dexterity = 0 : playerStats.dexterity += addedDexterity;
   
    if (playerStats.vitality + addedVitality <= 0) {
        // game over function needed
        console.log(`game over`);
    } else if (playerStats.vitality + addedVitality > 20) {
        playerStats.vitality = 20;
    } else {
        playerStats.vitality += addedVitality;
    }
    
    document.getElementById("player-strength").innerHTML = playerStats.strength;
    document.getElementById("player-agility").innerHTML = playerStats.agility;
    document.getElementById("player-dexterity").innerHTML = playerStats.dexterity;
    document.getElementById("player-vitality").innerHTML = playerStats.vitality;
}

// function updates villain stats
function villainStatsUpdate(strength, agility, dexterity) {
    const addedStrength = strength == "?" ? 0 : Number(strength);
    const addedAgility = strength == "?" ? 0 : Number(strength);
    const addedDexterity = strength == "?" ? 0 : Number(strength);
    
    villainStats.strength + addedStrength < 0 ? villainStats.strength = 0 : villainStats.strength += addedStrength;
    villainStats.agility + addedAgility < 0 ? villainStats.agility = 0 : villainStats.agility += addedAgility;
    villainStats.dexterity + addedDexterity < 0 ? villainStats.dexterity = 0 : villainStats.dexterity += addedDexterity;
    
    document.getElementById("villain-strength").innerHTML = villainStats.strength;
    document.getElementById("villain-agility").innerHTML = villainStats.agility;
    document.getElementById("villain-dexterity").innerHTML = villainStats.dexterity;
}






// adjust villain stats based on potion used
function adjustvillainStats(strength, agility, dexterity) {
    /*
    document.getElementById("villain-strength").innerHTML += strength;
    document.getElementById("villain-agility").innerHTML += agility;
    document.getElementById("villain-dexterity").innerHTML += dexterity;
    */
}
