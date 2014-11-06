sand.define('Moods/Bar', [
  'Seed',
  'DOM/toDOM',
  'Moods/Resource',
], function(r) {

/*
**Fire: 2
**On:   0
*/
var Bar = r.Seed.extend({

    /*tpl: function() {
      return {
        tag: '.moods-topbar'
      }
    },*/

    '+init' : function(opt) {

      this.scope = {}
      this.el = r.toDOM({ tag : ".moods"+(opt.side ? "-"+opt.side : ""), children : [{ tag : '.resources'+(opt.type || "")}]} , this.scope);
      this.scope.resources.setAttribute("dropzone",true);

      this.query('dp').resources.on('insert', this.insertResource.bind(this));
      this.query('dp').resources.on('delete', this.deleteResource.bind(this));
    },

    insertResource : function (model, options) {
      this.scope.resources.appendChild(this.create(r.Resource,{ src: model.src,title : model.title},'lastResource').el);
    },

    deleteResource: function(model, options) {
      ;
    }

  });
  return Bar;
});
