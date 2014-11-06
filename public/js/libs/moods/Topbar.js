sand.define('Moods/Topbar', [
  'Seed'
], function(r) {

/*
**Fire: 2
**On:   0
*/
var Topbar = r.Seed.extend({

    tpl: function() {
      return {
        tag: '.moods-topbar'
      }
    },

    setResources: function(data) {
      ;
    }

  });
  return Topbar;
});
