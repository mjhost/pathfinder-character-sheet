(function(rules){
    rules.classes.cleric = {
            combat:{
                bab:function(level){
                    return rules.combat.bab.hybrid(level);
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
                    return rules.saves.strong(level);
                }
            }
        };
 }(window.rules));