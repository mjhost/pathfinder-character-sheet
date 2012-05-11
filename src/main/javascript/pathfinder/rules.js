/*global console*/

var rules = {
    classes:{},
    races:{},
    utils:{
        toModifierString: function(modifier){
            return (modifier >= 0 ? '+' : '') + modifier;
        },
        updateCharacter:function(character){
            var computed,
                toReason, extractBonuses, extractInnerBonus, loopForBonuses,
                ability, caste, save, value, level, bonus;
            
            computed = {
                abilities:{},
                saves:{
                    fortitude:{reason:[], bonuses:{}, score:0},
                    reflex:{reason:[], bonuses:{}, score:0},
                    will:{reason:[], bonuses:{}, score:0}
                },
                classes: rules.getAggregateLevels(character.levels),
                armor:{reason:[], bonuses:{}, score:0}
            };

            toReason = function(bonus, value, name, slot){
                if(slot && name){
                    return (bonus || '') + (bonus ? ' ' : '') + rules.utils.toModifierString(value) + " (" + name + " ["+slot+"])";                    
                }else if (name){
                    return (bonus || '') + (bonus ? ' ' : '') + rules.utils.toModifierString(value) + " (" + name + ")";
                }else{
                    return (bonus || '') + (bonus ? ' ' : '') + rules.utils.toModifierString(value);
                }
            };
            
            extractBonuses = function(items, name, slot, stackable){
                var item, bonus;
                for(item in items){
                    if(items.hasOwnProperty(item)){
                        extractInnerBonus(items[item],name,slot,computed[item], stackable);
                    }
                }
            };

            extractInnerBonus = function(item, name, slot, stackable){
                var bonus;
                for(bonus in item){
                    if(item.hasOwnProperty(bonus)){
                        //console.log(bonus, item, name, slot, computed);
                        value = item[bonus];
                        if(stackable){
                            computed.bonuses[bonus] = (computed.bonuses[bonus] || 0) + value;
                        }else{
                            computed.bonuses[bonus] = Math.max((computed.bonuses[bonus] || 0), value);                            
                        }
                        computed.reason.push(toReason(bonus, value, name, slot));
                        computed.hasBonus = true;
                    }                                
                }
            };
            
            loopForBonuses = function(obj){
                var prop;
                //TODO add combat!
                for(prop in obj){
                    if(obj.hasOwnProperty(prop) && obj[prop]){
                        if(obj[prop].abilities){
                            extractBonuses(obj[prop].abilities, obj[prop].name, prop, computed.abilities);
                        }
                        if(obj[prop].saves){
                            extractBonuses(obj[prop].saves, obj[prop].name, prop, computed.saves);
                        }
                        if(obj[prop].armor){
                            extractInnerBonus(obj[prop].armor, obj[prop].name, prop, computed.armor);
                        }
                        if(obj[prop].penalties){
                            console.warn("there are unaccounted equip penalties!");
                        }
                    }
                }
            };

            for(ability in character.abilities){
                if(character.abilities.hasOwnProperty(ability)){
                    computed.abilities[ability]={};
                    computed.abilities[ability].reason = [toReason(null,character.abilities[ability].base, 'Base')];
                    computed.abilities[ability].hasBonus = false;
                    computed.abilities[ability].base = character.abilities[ability].base;
                    computed.abilities[ability].bonuses = {};
                    if(character.abilities[ability].hasOwnProperty('racial')){
                        computed.abilities[ability].bonuses.racial = character.abilities[ability].racial;
                        computed.abilities[ability].reason.push(toReason('racial',character.abilities[ability].racial));
                    }
                }
            }

            for(caste in computed.classes){
                if(computed.classes.hasOwnProperty(caste)){
                    for(save in computed.saves){
                        if(computed.saves.hasOwnProperty(save)){
                            value = rules.classes[caste].saves[save](computed.classes[caste]);
                            computed.saves[save].bonuses.level = (computed.saves[save].bonuses.level || 0) + value;
                            computed.saves[save].reason.push(toReason(null,value, caste + ' ' + computed.classes[caste]));
                        }
                    }
                }
            }

            for(level = 0; level < character.levels; level += 1){
                if(character.levels[level].bonus.abilities){
                    extractBonuses(character.levels[level].bonus.abilities, 'level', +level+1, computed.abilities, true);
                }
            }

            loopForBonuses(character.equip.slots, computed);
            loopForBonuses(character.buffs, computed);            

            for(ability in computed.abilities){
                if(computed.abilities.hasOwnProperty(ability)){
                    computed.abilities[ability].score = computed.abilities[ability].base;
                    for(bonus in computed.abilities[ability].bonuses){
                        if(computed.abilities[ability].bonuses.hasOwnProperty(bonus)){
                            computed.abilities[ability].score += computed.abilities[ability].bonuses[bonus];
                        }
                    }
                    computed.abilities[ability].modifier = rules.abilities.getModifier(computed.abilities[ability].score);
                }
            }
            
            computed.saves.fortitude.bonuses.constitution = computed.abilities.constitution.modifier;
            computed.saves.fortitude.reason.unshift('constitution ' + rules.utils.toModifierString(computed.abilities.constitution.modifier));
            computed.saves.reflex.bonuses.dexterity = computed.abilities.dexterity.modifier;
            computed.saves.reflex.reason.unshift('dexterity ' + rules.utils.toModifierString(computed.abilities.dexterity.modifier));
            computed.saves.will.bonuses.wisdom = computed.abilities.wisdom.modifier;
            computed.saves.will.reason.unshift('wisdom ' + rules.utils.toModifierString(computed.abilities.wisdom.modifier));
            
            for(save in computed.saves){
                if(computed.saves.hasOwnProperty(save) && computed.saves[save].bonuses){
                    for(bonus in computed.saves[save].bonuses){
                        if(computed.saves[save].bonuses.hasOwnProperty(bonus)){
                            computed.saves[save].score += computed.saves[save].bonuses[bonus];
                        }
                    }
                }
            }
            
            computed.armor.bonuses.dexterity = computed.abilities.dexterity.modifier;
            computed.armor.reason.unshift(toReason('dexterity', computed.abilities.dexterity.modifier));
            computed.armor.bonuses.size = rules.combat.getSizeBonus(character);
            computed.armor.reason.unshift(toReason('size', computed.armor.bonuses.size));
            computed.armor.bonuses.base = 10;
            computed.armor.reason.unshift(toReason(null, 10, 'Base'));
            
            for(bonus in computed.armor.bonuses){
                if(computed.armor.bonuses.hasOwnProperty(bonus)){
                    computed.armor.score += computed.armor.bonuses[bonus];
                }
            }
            
            return computed;
        }
    },
    abilities:{
        getModifier: function(score){
            return Math.floor(score/ 2)-5;  
        },
        getBonusSpell: function(score, level){
            var temp = Math.ceil((rules.abilities.getModifier(score) - level + 1) / 4);
            return (temp > 0 && level > 0)? temp : 0;
        }
    },
    sizes:['Colossal', 'Gargantuan', 'Huge', 'Large', 'Medium', 'Small', 'Tiny', 'Diminutive', 'Fine'],
    spells:{
        daily:function(table,casterLevel,spellLevel){
            if(table && casterLevel && casterLevel<table.length){
                if(spellLevel && spellLevel<table[casterLevel].length){
                    return table[casterLevel][spellLevel];
                }else{
                    return table[casterLevel];
                }
            }
            return '-';
        }
    },
    saves:{
        strong: function(level){
            return Math.floor(level/2)+2;
        },
        normal: function(level){
            return Math.floor(level/3);
        }
    },
    combat:{
        getSizeBonus:function(character){
            var size = character.size -4;
            if(size == 0){
                return 0;
            }
            return (size<0?-1:1)*Math.pow(2,Math.abs(size)-1);
        },
        getBaseAttackBonus: function(classes){
            var babTotal=0, caste;
            for(caste in classes){
                if(classes.hasOwnProperty(caste)){
                    babTotal += rules.classes[caste].combat.bab(classes[caste]);
                }
            }
            return babTotal;
        },
        armor:function(character){
            return 10 + 'armor bonus' + 'shield bonus' + character.computed.abilities.dexterity.modifier + 'enhancement bonuses' + 'deflection bonus' + 'natural armor' + 'dodge bonus' + this.combat.getSizeBonus(character);
        },
        bab:{
            melee:function(level){
                return level;
            },
            hybrid:function(level){
                return Math.floor(level*3/4);
            },
            caster:function(level){
                return Math.floor(level/2);
            }
        }
    },
    getTotalLevel: function(levels){
        return levels.length;
    },
    getAggregateLevels: function(levels){
        var i, aggregate = {};
        for(i=0;i<levels.length;i++){
            aggregate[levels[i].caste] = (aggregate[levels[i].caste] || 0) + 1;
        }
        return aggregate;  
    }
};