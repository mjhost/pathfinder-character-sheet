var rules = {
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
                if(character.abilities[ability].hasOwnProperty('racial')){
                    computed[ability].racial = character.abilities[ability].racial;
                    computed[ability].reason.push('Racial ' + (computed[ability].racial>0?' +':' ') + computed[ability].racial);
                }
            }
        }

        for(iterator in character.levels){
            if(character.levels.hasOwnProperty(iterator)){
                if(character.levels[iterator].bonus.abilities){
                    for(ability in character.levels[iterator].bonus.abilities){
                        if(character.levels[iterator].bonus.abilities.hasOwnProperty(ability)){
                            computed[ability].level = (computed[ability].level || 0) + character.levels[iterator].bonus.abilities[ability].level;
                            computed[ability].reason.push('Level ' + (parseInt(iterator)+1)  + ' +1');
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
                                    computed[ability][bonus] = Math.max((computed[ability][bonus] || 0), character.equip.slots[iterator].abilities[ability][bonus]);
                                    value = character.equip.slots[iterator].abilities[ability][bonus];
                                    computed[ability].reason.push(bonus + (value > 0 ? " +":" ") + value + " (" + character.equip.slots[iterator].name + " ["+iterator+"])");                                    
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
                                    computed[ability][bonus] = Math.max((computed[ability][bonus] || 0), character.buffs[iterator].abilities[ability][bonus]);
                                    value = character.buffs[iterator].abilities[ability][bonus];
                                    computed[ability].reason.push(bonus + (value > 0 ? " +":" ") + value + " (" +iterator+")");
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
                computed[ability].score = 0;
                for(bonus in computed[ability]){
                    if(computed[ability].hasOwnProperty(bonus)){
                        if(typeof(computed[ability][bonus])=="number" && bonus != "reason" && bonus != "score" && bonus != "hasBonus"){
                            computed[ability].score += computed[ability][bonus];
                        }
                    }
                }
            }
        }
        
        return computed;
    }
};