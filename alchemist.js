function testSpellPerDayFunction(f) {
  var s, casterLevel, level;
  s = ' ';
  for (level = 0; level <= 9; level++) {
    s += '\t' + level + '°';
  }
  s += '\n';
  for (casterLevel = 1; casterLevel <= 20; casterLevel++) {
    s += casterLevel + '°';
    for (level = 0; level <= 9; level++) {
      s += '\t' + f(casterLevel, level);
    }
    s += '\n';
  }
  return s;
}
(function(rules) {
  "use strict";
  rules.classes.alchemist = {
    combat: {
      bab: function(level) {
        return rules.combat.bab.hybrid(level);
      }
    },
    saves: {
      fortitude: function(level) {
        return rules.saves.strong(level);
      },
      reflex: function(level) {
        return rules.saves.strong(level);
      },
      will: function(level) {
        return rules.saves.normal(level);
      }
    },
    spells: {
      // rules.classes.alchemist.spells._daily
      _daily: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 2, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 3, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 3, 1, 0, 0, 0, 0, 0, 0],
        [0, 4, 4, 2, 0, 0, 0, 0, 0, 0],
        [0, 5, 4, 3, 0, 0, 0, 0, 0, 0],
        [0, 5, 4, 3, 1, 0, 0, 0, 0, 0],
        [0, 5, 4, 4, 2, 0, 0, 0, 0, 0],
        [0, 5, 5, 4, 3, 0, 0, 0, 0, 0],
        [0, 5, 5, 4, 3, 1, 0, 0, 0, 0],
        [0, 5, 5, 4, 4, 2, 0, 0, 0, 0],
        [0, 5, 5, 5, 4, 3, 0, 0, 0, 0],
        [0, 5, 5, 5, 4, 3, 1, 0, 0, 0],
        [0, 5, 5, 5, 4, 4, 2, 0, 0, 0],
        [0, 5, 5, 5, 5, 4, 3, 0, 0, 0],
        [0, 5, 5, 5, 5, 5, 4, 0, 0, 0],
        [0, 5, 5, 5, 5, 5, 5, 0, 0, 0]
      ],
      daily: function(casterLevel, level) {
        return rules.classes.alchemist.spells._daily[casterLevel][level];
        /*
        var count, limit, maxLevel;
        maxLevel = Math.floor(casterLevel / 3) + 1;
        count = casterLevel - 3 * (level - 1);
        if (level <= 0 || level >= 7) {
          count = 0;
        } else if (level <= 4) {
          count = count - Math.max(count - 3, 0) + Math.ceil(Math.max((count / 4) - 1, 0));
          // limit = Math.max(count-5, 0) + Math.max(0, Math.ceil((count-6)^2 / -8 + 1));
        } else if (level == 5) {
          // TODO
        }
        // count -= limit > 0 ? limit : 0;
        count = Math.min(count, 5);
        return count > 0 ? count : '-';
        */
      }
    }
  };
}(rules));
