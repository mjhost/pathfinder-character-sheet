(function(rules){
    rules.classes.paladin = {
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
                    return rules.saves.normal(level);
                },
                will: function(level){
                    return rules.saves.strong(level);
                }
            }
        };
 }(window.rules));