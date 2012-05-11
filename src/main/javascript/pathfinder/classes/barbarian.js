(function(rules){
    rules.classes.barbarian = {
            combat:{
                bab: function(level){
                    return rules.combat.bab.melee(level);
                }                
            },
            saves:{
                fortitude: function(level){
                    return rules.saves.strong(level);
                },
                reflex: function(level){
                    return rules.saves.normal(level);
                },
                will: function(level){
                    return rules.saves.normal(level);
                }
            }
        };
 }(window.rules));  