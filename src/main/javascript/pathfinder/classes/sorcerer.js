(function(rules){
    rules.classes.sorcerer = {
            combat:{
                bab:function(level){
                    return rules.combat.bab.caster(level);
                }
            },
            saves:{
                fortitude: function(level){
                    return rules.saves.normal(level);
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