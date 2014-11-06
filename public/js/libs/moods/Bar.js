sand.define('Moods/Bar', [
  'Seed',
  'DOM/toDOM',
  'Moods/Resource',
], function(r) {

/*
**Fire: 2
**On:   0
*/
var Topbar = r.Seed.extend({

    /*tpl: function() {
      return {
        tag: '.moods-topbar'
      }
    },*/

    '+init' : function(opt) {
      
      this.scope = {}
      this.el = r.toDOM({ tag : ".moods"+(opt.side ? "-"+opt.side : ""), children : [{ tag : '.resources'+(opt.type || "")}]} , this.scope);
      this.scope.resources.setAttribute("dropzone",true);
      this.scope.resources.setAttribute("side",opt.side);

      this.scope['resources'+(opt.type || "")].onResourceDropped = function (id,dropIndex) {
          this.fire('onResourceDropped',id,dropIndex);
      }.bind(this)

    },

    addResource : function (src,title) {
      this.scope.resources.appendChild(this.create(r.Resource,{ src: src,title : title},'lastResource').el);
    },

    setResources: function(data) {
      ;
    }

  });
  return Topbar;
});
