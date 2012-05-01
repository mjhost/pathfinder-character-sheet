var rules = {
    utils:{
        toModifierString: function(modifier){
            return (modifier > 0 ? '+' : '') + modifier;
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
    saves:{
        getSaves:function(character){
            var computed, classIterator, bonus, save, iterator, value;
            computed = {
                fortitude:{
                    reason:['constitution ' + rules.utils.toModifierString(character.computed.abilities.constitution.modifier)],
                    bonuses:{constitution: character.computed.abilities.constitution.modifier},
                    score:0
                },
                reflex:{
                    reason:['dexterity ' + rules.utils.toModifierString(character.computed.abilities.dexterity.modifier)],
                    bonuses:{dexterity: character.computed.abilities.dexterity.modifier},
                    score:0
                },
                will:{
                    reason:['wisdom ' + rules.utils.toModifierString(character.computed.abilities.wisdom.modifier)],
                    bonuses:{wisdom: character.computed.abilities.wisdom.modifier},
                    score:0
                }
            };
            for(classIterator in character.computed.levels){
                if(character.computed.levels.hasOwnProperty(classIterator)){
                    for(save in computed){
                        if(computed.hasOwnProperty(save)){
                            bonus = rules.classes[classIterator].saves[save](character.computed.levels[classIterator]);
                            computed[save].bonuses.level = (computed[save].bonuses.level || 0) + bonus;
                            computed[save].reason.push(classIterator + ' ' + character.computed.levels[classIterator] + ': ' + rules.utils.toModifierString(bonus));
                        }
                    }
                }
            }
            
            for(iterator in character.equip.slots){
                if(character.equip.slots.hasOwnProperty(iterator)){
                    if(character.equip.slots[iterator] && character.equip.slots[iterator].saves){
                        for(save in character.equip.slots[iterator].saves){
                            if(character.equip.slots[iterator].saves.hasOwnProperty(save)){
                                for(bonus in character.equip.slots[iterator].saves[save]){
                                    if(character.equip.slots[iterator].saves[save].hasOwnProperty(bonus)){
                                        value = character.equip.slots[iterator].saves[save][bonus];
                                        computed[save].bonuses[bonus] = Math.max((computed[save].bonuses[bonus] || 0), value);
                                        computed[save].reason.push(bonus + rules.utils.toModifierString(value) + " (" + character.equip.slots[iterator].name + " ["+iterator+"])");                                    
                                        computed[save].hasBonus = true;
                                    }                                
                                }
                            }
                        }
                    }
                }
            }
    
            for(iterator in character.buffs){
                if(character.buffs.hasOwnProperty(iterator)){
                    if(character.buffs[iterator].saves){
                        for(save in character.buffs[iterator].saves){
                            if(character.buffs[iterator].saves.hasOwnProperty(save)){
                                for(bonus in character.buffs[iterator].saves[save]){
                                    if(character.buffs[iterator].saves[save].hasOwnProperty(bonus)){
                                        value = character.buffs[iterator].saves[save][bonus];
                                        computed[save].bonuses[bonus] = Math.max((computed[save].bonuses[bonus] || 0), value);
                                        computed[save].reason.push(bonus + rules.utils.toModifierString(value) + " (" +iterator+")");
                                        computed[save].hasBonus = true;
                                    }                                
                                }
                            }
                        }
                    }
                }
            }
            
            for(save in computed){
                if(computed.hasOwnProperty(save)){
                    for(bonus in computed[save].bonuses){
                        if(computed[save].bonuses.hasOwnProperty(bonus)){
                            computed[save].score += computed[save].bonuses[bonus];
                        }
                    }
                }
            }
            
            return computed;
        },
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
        getBaseAttackBonus: function(levels){
            var babTotal=0, cl;
            for(cl in levels){
                if(levels.hasOwnProperty(cl)){
                    //console.log(cl, rules.classes[cl].combat.bab);
                    babTotal += rules.classes[cl].combat.bab(levels[cl]);
                    //babTotal += rules.combat.bab[rules.classes[cl].combat.bab].call(this, levels[cl]);
                }
            }
            return babTotal;
        },
        armor:function(character){
            return 10 + 'armor bonus' + 'shield bonus' + 'dex modifier' + 'enhancement bonuses' + 'deflection bonus' + 'natural armor' + 'dodge bonus' + this.combat.getSizeBonus(character);
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
            aggregate[levels[i]['class']] = (aggregate[levels[i]['class']] || 0) + 1;
        }
        //console.log(aggregate);
        return aggregate;  
    },
    getAbilities: function(character){
        var ability, computed, iterator, bonus, value;
        computed = {};
        for(ability in character.abilities){
            if(character.abilities.hasOwnProperty(ability)){
                computed[ability]={};
                computed[ability].reason = ['Base ' + character.abilities[ability].base];
                computed[ability].hasBonus = false;
                computed[ability].base = character.abilities[ability].base;
                computed[ability].bonuses = {};
                if(character.abilities[ability].hasOwnProperty('racial')){
                    computed[ability].bonuses.racial = character.abilities[ability].racial;
                    computed[ability].reason.push('Racial ' + rules.utils.toModifierString(computed[ability].bonuses.racial));
                }
            }
        }

        for(iterator in character.levels){
            if(character.levels.hasOwnProperty(iterator)){
                if(character.levels[iterator].bonus.abilities){
                    for(ability in character.levels[iterator].bonus.abilities){
                        if(character.levels[iterator].bonus.abilities.hasOwnProperty(ability)){
                            computed[ability].bonuses.level = (computed[ability].bonuses.level || 0) + character.levels[iterator].bonus.abilities[ability].level;
                            computed[ability].reason.push('Level ' + (iterator+1)  + ' +1');
                        }
                    }
                }
            }
        }
        
        for(iterator in character.equip.slots){
            if(character.equip.slots.hasOwnProperty(iterator)){
                if(character.equip.slots[iterator] && character.equip.slots[iterator].abilities){
                    for(ability in character.equip.slots[iterator].abilities){
                        if(character.equip.slots[iterator].abilities.hasOwnProperty(ability)){
                            for(bonus in character.equip.slots[iterator].abilities[ability]){
                                if(character.equip.slots[iterator].abilities[ability].hasOwnProperty(bonus)){
                                    value = character.equip.slots[iterator].abilities[ability][bonus];
                                    computed[ability].bonuses[bonus] = Math.max((computed[ability].bonuses[bonus] || 0), value);
                                    computed[ability].reason.push(bonus + rules.utils.toModifierString(value) + " (" + character.equip.slots[iterator].name + " ["+iterator+"])");                                    
                                    computed[ability].hasBonus = true;
                                }                                
                            }
                        }
                    }
                }
            }
        }

        for(iterator in character.buffs){
            if(character.buffs.hasOwnProperty(iterator)){
                if(character.buffs[iterator].abilities){
                    for(ability in character.buffs[iterator].abilities){
                        if(character.buffs[iterator].abilities.hasOwnProperty(ability)){
                            for(bonus in character.buffs[iterator].abilities[ability]){
                                if(character.buffs[iterator].abilities[ability].hasOwnProperty(bonus)){
                                    value = character.buffs[iterator].abilities[ability][bonus];
                                    computed[ability].bonuses[bonus] = Math.max((computed[ability].bonuses[bonus] || 0), value);
                                    computed[ability].reason.push(bonus + rules.utils.toModifierString(value) + " (" +iterator+")");
                                    computed[ability].hasBonus = true;
                                }                                
                            }
                        }
                    }
                }
            }
        }
        
        for(ability in computed){
            if(computed.hasOwnProperty(ability)){
                computed[ability].score = computed[ability].base;
                for(bonus in computed[ability].bonuses){
                    if(computed[ability].bonuses.hasOwnProperty(bonus)){
                        computed[ability].score += computed[ability].bonuses[bonus];
                    }
                }
                computed[ability].modifier = rules.abilities.getModifier(computed[ability].score);
            }
        }
        
        return computed;
    }
};