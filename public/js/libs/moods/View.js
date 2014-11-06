sand.define('Moods/View', [
  'DOM/toDOM',
  'Seed',
  'DataPackage/Controller->DP',
  'Moods/Upload',
  'Moods/Cover',
], function(r) {

  var View = r.Seed.extend({

    isMediator: true,
    respondsTo: { dp: function() {return this.dp;} },

    options: function() {
    },

    tpl: function() {
      return {
        tag: '.moods-view', children: [
          {tag: '.moods-view-image-container', as: 'imgContainer'},
          {tag: '.moods-view-comment', as: 'comment'}
        ]}
    },

    setCurrent: function(model) {
      this.imgContainer.innerHTML = '';
      console.log(model);
      if (model.el) this.imgContainer.appendChild(model.el);
      else {
        /*Resize ?*/
        this.imgContainer.appendChild(r.toDOM({
          tag: '.moods-view-img',
          style: {backgroundIimage: 'url(' + model.src + ')'}
        }));
      }
      this.imgContainer.appendChild(r.toDOM({
        tag: '.moods-view-comment ' + model.comment
      }));
    },

  });

  return View;

});
