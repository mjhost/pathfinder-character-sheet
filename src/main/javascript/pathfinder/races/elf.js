(function(rules){
    rules.races.elf={
        size:4,
        abilities:{
            dexterity:2,
            intelligence:2,
            constitution:-2
        },
        special:['low-light'],
        immunities:['sleep'],
        resistances:{
            enchantment:2
        },
        spell:{
            resistance:2
        },
        skills:{
            spellcraft:{
                bonus:2,
                task:'identify magic item'
            },
            perception:{
                bonus:2
            }
        },
        proficiencies:{//will be regexps
            basic: ['longbows', 'longswords', 'rapiers', 'shortbows'],
            martial: ['*elven*']
        },
        languages:{
            basic: ['Common', 'Elven'],
            bonus: ['Celestial', 'Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan']
        },
        feats:['Breadth of Experience', 'Elven Accuracy', 'Leaf Singer', 'Light Step', 'Stabbing Shot']
    }
}(window.rules));