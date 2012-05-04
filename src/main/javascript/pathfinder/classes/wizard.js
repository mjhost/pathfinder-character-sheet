(function(rules){
    rules.classes.wizard = {
        combat:{
            bab: function(level){
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
        },
        spells:{
            table:[
                [3,1],
                [4,2],
                [4,2,1],
                [4,3,2],
                [4,3,2,1],
                [4,3,3,2],
                [4,4,3,2,1],
                [4,4,3,3,2],
                [4,4,4,3,2,1],
                [4,4,4,3,3,2],
                [4,4,4,4,3,2,1],
                [4,4,4,4,3,3,2],
                [4,4,4,4,4,3,2,1],
                [4,4,4,4,4,3,3,2],
                [4,4,4,4,4,4,3,2,1],
                [4,4,4,4,4,4,3,3,2],
                [4,4,4,4,4,4,4,3,2,1],
                [4,4,4,4,4,4,4,3,3,2],
                [4,4,4,4,4,4,4,4,3,3],
                [4,4,4,4,4,4,4,4,4,4]
            ],
            daily: function(casterLevel,spellLevel){
                return rules.spells.daily(rules.classes.wizard.spells.table, casterLevel, spellLevel);
            },
            type:"arcane"
        }
    };
}(window.rules));