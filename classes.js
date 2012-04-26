(function(rules){
    rules.classes = {
        barbarian:{
            combat:{
                bab: function(level){
                    return rules.combat.bab.melee(level);
                }                
            }
        },
        bard:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.hybrid(level);
                }
            }
        },
        cleric:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.hybrid(level);
                }
            }
        },
        druid:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.hybrid(level);
                }
            }
        },
        fighter:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.melee(level);
                }
            }
        },
        monk:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.hybrid(level);
                }
            }
        },
        paladin:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.melee(level);
                }
            }
        },
        ranger:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.melee(level);
                }
            }
        },
        rogue:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.hybrid(level);
                }
            }
        },
        sorcerer:{
            combat:{
                bab:function(level){
                    return rules.combat.bab.caster(level);
                }
            }
        }
    };
}(rules));