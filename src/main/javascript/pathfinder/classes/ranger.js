(function(rules){
    rules.classes.ranger = {
            combat:{
                bab:function(level){
                    return rules.combat.bab.melee(level);
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
                    return rules.saves.normal(level);
                }
            }
        };
 }(window.rules));