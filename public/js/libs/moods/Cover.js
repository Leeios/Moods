sand.define('Moods/Cover', [
  'Seed',
  'DOM/toDOM',
  'DataPackage/Controller->DP',
  'Moods/Upload',
  'Moods/View'
], function(r) {

  var Cover = r.Seed.extend({

    tpl: function() {
      return {
        tag: '.moods-cover'
      }
    }

  });
  return Cover;
});
