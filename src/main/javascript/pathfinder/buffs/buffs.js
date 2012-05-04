(function(rules){
    rules.buffs = {
        "Bear's Endurance":{
            "abilities":{
                "constitution":{
                    "enhancement":4
                }
            }
        },
        "Bull's Strength":{
            "abilities":{
                "strength":{
                    "enhancement":4
                }
            }
        },
        "Cat's grace": {
            "abilities": {
                "dexterity":{
                    "enhancement": 4
                }
            }
        },
        "Eagle's Splendor":{
            "abilities":{
                "charisma":{
                    "enhancement":4
                }
            }
        },
        "Fox's Cunning":{
            "abilities":{
                "intelligence":{
                    "enhancement":4
                }
            }
        },
        "Owl's Wisdom":{
            "abilities":{
                "wisdom":{
                    "enhancement":4
                }
            }
        },
        "Mage Armor":{
            "armor":{
                "armor":4
            }
        },
        "Divine Favor":{
            "combat":{
                "attack":{
                    "luck": 1
                },
                "damage":{
                    "luck": 1
                }
            },
            "adjustment":{
                "parameter": "caster level",
                "type":"number",
                "multiplier": function(param){
                    return Math.max(Math.floor(param/3)+1, 3);
                }
            }
        },
        "Fly":{
            "general":{
                "speed":60
            }
        }
    };
}(window.rules));
