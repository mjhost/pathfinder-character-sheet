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
            daily:function(casterLevel, level){
                if(level==0){
                    return casterLevel == 1 ? 3 : 4;
                }else if(level==9){
                    return Math.max(0,casterLevel - 16)||'-';
                }else if((casterLevel+1)/2<level){
                    return '-';
                }else if((casterLevel+1)/2==level){
                    return 1;
                }else if(Math.floor((casterLevel)/2) == level){
                    return 2;
                }else if((casterLevel-5)/2<level && (casterLevel != 20)){
                    return 3;
                }else{
                    return 4;
                }
            }
        }
    };
}(rules));