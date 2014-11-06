sand.define('Moods/Leftbar', [
  'Seed'
], function(r) {

/*
**Fire: 2
**On:   0
*/
var Leftbar = r.Seed.extend({

    tpl: function() {
      return {
        tag: '.moods-leftbar'
      }
    },

  });
  return Leftbar;
});
