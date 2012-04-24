var currentCharacter, scheda;

scheda = {
    writeAbilities: function(abilities){
        var ability, $abilities;
        $abilities = $('.abilities')
        for(ability in abilities){
            if(abilities.hasOwnProperty(ability)){
                if(abilities[ability].hasBonus){
                    $abilities.find('.'+ability).addClass("hasBonus");
                }else{
                    $abilities.find('.'+ability).removeClass("hasBonus");
                }
                $abilities.find('.'+ability + ' th.heading').attr('data-original-title',abilities[ability].reason.join(', '));
                $abilities.find('.'+ability+ ' .score').text(abilities[ability].score.toString());
                $abilities.find('.'+ability+ ' .modifier').text(rules.abilities.getModifier(abilities[ability].score).toString());
            }
        }
        $abilities.find('th.heading').tooltip({placement:'right'});
    },
    writeAvailableBuffs: function(buffs){
        var buff, template, $buff;
        template = "<li><a href='#'>${label}</a></li>";
        for(buff in buffs){
            if(buffs.hasOwnProperty(buff)){
                $buff = $(template.replace('${label}', buff)).data('effect', buffs[buff]);
                if(buffs[buff].hasOwnProperty('abilities')){
                    $('.buffs .nav-header.abilities').after($buff);
                }else if(buffs[buff].hasOwnProperty('armor')){
                    $('.buffs .nav-header.armor').after($buff);
                }else if(buffs[buff].hasOwnProperty('combat')){
                    $('.buffs .nav-header.combat').after($buff);
                }else if(buffs[buff].hasOwnProperty('general')){
                    $('.buffs .nav-header.general').after($buff);
                }else{
                    $('.buffs').append($buff).data('effect', buffs[buff]);
                }
            }
        }
        $('.buffs a').unbind('click').click(function(event){
                var $buff, buff;
                $buff = $(event.currentTarget).parent();
                buff = $buff.text();
                if(currentCharacter.buffs.hasOwnProperty(buff)){
                    delete currentCharacter.buffs[buff];
                    $buff.find('i').remove();
                }else{
                    currentCharacter.buffs[buff] = $buff.data('effect');
                    $buff.find('a').prepend("<i class='icon-star-empty icon-yellow'></i>");
                }
                if(buffs[buff].hasOwnProperty('abilities')){
                    scheda.writeBuffables(rules.getAbilities(currentCharacter));
                }
                return false;
            });
    },
    writeBuffables: function(character){
        var bab, sizeBonus, abilities;
        abilities = rules.getAbilities(currentCharacter);
        scheda.writeAbilities(abilities);
        
        bab = rules.combat.getBaseAttackBonus(rules.getAggregateLevels(currentCharacter.levels));
        sizeBonus = rules.combat.getSizeBonus(currentCharacter);
        
        //console.log('melee', bab, parseInt($('table.abilities tr.strength td.modifier').text()), sizeBonus);
        //console.log('ranged', bab, parseInt($('table.abilities tr.dexterity td.modifier').text()), sizeBonus);
        
        $('#scheda table.combat td.attack.melee').html(bab + parseInt($('table.abilities tr.strength td.modifier').text()) + sizeBonus);
        $('#scheda table.combat td.attack.ranged').html(bab + parseInt($('table.abilities tr.dexterity td.modifier').text()) + sizeBonus);
    },
    writeEquip: function(equip){
        var template, slot, $slot;
        template = "<tr><th>${slot}</th><td>${name}</td></tr>";
        for(slot in equip.slots){
            if(equip.slots.hasOwnProperty(slot) && equip.slots[slot]){
                $slot = template.replace('${slot}', slot).replace('${name}', equip.slots[slot].name);
                $('table.equip').append($slot);
            }
        }
    },
    getLevels: function(levels){
        //TODO ordinare per livelli!!!
        var c, arr = [];
        for(c in levels){
            if(levels.hasOwnProperty(c)){
                arr.push(c.toUpperCase() + " " + levels[c]);
            }
        }
        return arr.join(', ');
    },
    getOtherInfos: function(character){
        var aInfo = [];
        aInfo.push("gender " + character.other.gender);
        aInfo.push("height " + character.other.height + "cm");
        aInfo.push("weight " + character.other.weight + "kg");
        return aInfo.join(', ')
    },
    writeCharacter: function(character){
        $('#scheda .character .name h1').html(character.name + ' <small>(' + character.race + ' ' + character.alignment + ' )</small>');
        $('#scheda .character .levels h2').html(scheda.getLevels(rules.getAggregateLevels(currentCharacter.levels)));
        $('#scheda .character .level h2').html('Lvl ' + rules.getTotalLevel(currentCharacter.levels));        
        $('#scheda .character .other-info').html(scheda.getOtherInfos(currentCharacter));
        
        scheda.writeBuffables(currentCharacter);
        scheda.writeEquip(currentCharacter.equip);
    }
    
}


$(document).ready(function(){
    console.log('document ready');
    scheda.writeAvailableBuffs(rules.buffs);
    $.ajax({
        url:'prywin.json',
        success:function(data){
            console.log('character loaded');
            currentCharacter = data;
            currentCharacter.buffs = {};
            scheda.writeCharacter(currentCharacter);
        },
        error:function(jqXHR, textStatus, errorThrown){
          console.log('error loading character', jqXHR, textStatus, errorThrown);  
        },
        dataType:'json'
    });
});

