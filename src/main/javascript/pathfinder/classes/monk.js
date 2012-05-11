(function(rules){
    rules.classes.monk = {
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
                    return rules.saves.strong(level);
                },
                will: function(level){
                    return rules.saves.strong(level);
                }
            }
        };
 }(window.rules));