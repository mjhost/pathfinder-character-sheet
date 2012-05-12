(function(rules){
    rules.skills = {
        acrobatics:{untrained:true, key:"dexterity"},
        appraise:{untrained:true, key:"intelligence"},
        bluff:{untrained:true, key:"charisma"},
        climb:{untrained:true, key:"strength"},
        diplomacy:{untrained:true, key:"charisma"},
        "disable device":{key:"dexterity"},
        disguise:{untrained:true, key:"charisma"},
        "escape artist":{untrained:true, key:"dexterity"},
        fly:{untrained:true, key:"dexterity"},
        "handle animal":{key:"charisma"},
        heal:{untrained:true, key:"wisdom"},
        intimidate:{untrained:true, key:"charisma"},
        arcana:{key:"intelligence"},
        dungeoneering:{key:"intelligence"},
        engineering:{key:"intelligence"},
        geography:{key:"intelligence"},
        history:{key:"intelligence"},
        local:{key:"intelligence"},
        nature:{key:"intelligence"},
        nobility:{key:"intelligence"},
        planes:{key:"intelligence"},
        religion:{key:"intelligence"},
        linguistics:{key:"intelligence"},
        perception:{untrained:true, key:"wisdom"},
        perform:{untrained:true, key:"charisma"},
        ride:{untrained:true, key:"dexterity"},
        "sense motive":{untrained:true, key:"wisdom"},
        "sleight of hand":{key:"dexterity"},
        spellcraft:{key:"intelligence"},
        stealth:{untrained:true, key:"dexterity"},
        survival:{untrained:true, key:"wisdom"},
        swim:{untrained:true, key:"strength"},
        "use magic device":{key:"charisma"}
    };
    
    rules.skills.profession = {};
    rules.skills.craft = {key:"intelligence"};
    
    rules.skills.getUntrained = function(skill){
            return skill.untrained || false;    
        };
    rules.skills.getArmorPenalty = function(skill){
            return skill.key == "strength" || skill.key == "dexterity";
        };
    rules.skill.checkBonus = function(){
        //computed.abilities[skill.key].modifier + racial.modifier + class_skill.modifier
    };
    
 }(window.rules));
