(function(rules){
    rules.classes.bard = {
            combat:{
                bab:function(level){
                    return rules.combat.bab.hybrid(level);
                }
            },
            saves:{
                fortitude: function(level){
                    return rules.saves.normal(level);
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