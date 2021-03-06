/*global $, jQuery, rules, console*/

var currentCharacter, scheda;

scheda = {
    writeAbilities: function(abilities){
        var ability, $abilities;
        $abilities = $('.abilities');
        for(ability in abilities){
            if(abilities.hasOwnProperty(ability)){
                if(abilities[ability].hasBonus){
                    $abilities.find('.'+ability).addClass("hasBonus");
                }else{
                    $abilities.find('.'+ability).removeClass("hasBonus");
                }
                $abilities.find('.'+ability + ' th.heading').attr('data-original-title',abilities[ability].reason.join(', '));
                $abilities.find('.'+ability+ ' .score').text(abilities[ability].score.toString());
                $abilities.find('.'+ability+ ' .modifier').text(rules.utils.toModifierString(abilities[ability].modifier.toString()));
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
                //if(buffs[buff].hasOwnProperty('abilities')){
                scheda.updateCharacter(currentCharacter);
                scheda.writeBuffables(currentCharacter);
                //}
                return false;
            });
    },
    writeBuffables: function(character){
        var bab, sizeBonus, abilities;
       
        scheda.writeAbilities(character.computed.abilities);
        
        bab = rules.combat.getBaseAttackBonus(character.computed.classes);
        sizeBonus = rules.combat.getSizeBonus(character);
        
        $('#scheda table.combat td.ac').html(character.computed.armor.score);
        
        $('#scheda table.combat td.attack.melee').html(rules.utils.toModifierString(bab + character.computed.abilities.strength.modifier + sizeBonus));
        $('#scheda table.combat td.attack.ranged').html(rules.utils.toModifierString(bab + character.computed.abilities.dexterity.modifier + sizeBonus));
        
        $('#scheda table.saves td.fortitude').html(rules.utils.toModifierString(character.computed.saves.fortitude.score));
        $('#scheda table.saves td.reflex').html(rules.utils.toModifierString(character.computed.saves.reflex.score));
        $('#scheda table.saves td.will').html(rules.utils.toModifierString(character.computed.saves.will.score));
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
        return aInfo.join(', ');
    },
    updateCharacter:function(character){
        character.computed = rules.utils.updateCharacter(character);
        //console.warn('updated');
    },
    writeCharacter: function(character){
        this.updateCharacter(character);

        $('#scheda .character .name h1').html(character.name + ' <small>(' + character.race + ' ' + character.alignment + ' )</small>');
        $('#scheda .character .levels h2').html(scheda.getLevels(currentCharacter.computed.classes));
        $('#scheda .character .level h2').html('Lvl ' + rules.getTotalLevel(currentCharacter.levels)); 
        $('#scheda .character .other-info').html(scheda.getOtherInfos(currentCharacter));

        scheda.writeBuffables(currentCharacter);
        scheda.writeEquip(currentCharacter.equip);
    }
};


$(document).ready(function(){
    console.log('document ready');
    scheda.writeAvailableBuffs(rules.buffs);
    scheda.writeAvailableBuffs(rules.feats);
    $.ajax({
        url:'prywin.json',
        cache:false,
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

