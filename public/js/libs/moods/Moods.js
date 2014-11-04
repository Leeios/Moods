sand.define('Moods/Master', [
  'DOM/toDOM',
  'Seed',
  'DataPackage/Controller->DP',
  'Moods/Topbar',
  'Moods/Leftbar',
  'Moods/Upload',
  'Moods/View',
  'Moods/Cover',
], function(r) {

  var Moods = r.Seed.extend({

    isMediator: true,
    respondsTo: { dp: function() {return this.dp;} },

    options: function() {
      return {
        dp: null,
        pages: [],
        cover: this.create(r.Cover),
        current: null
      }
    },

    tpl: function() {
      return {
        tag: '.moods', children: [
          this.create(r.Topbar, {}, 'topbar').el,
          this.create(r.Leftbar, {}, 'leftbar').el,
          this.create(r.Upload, {}, 'upload').el,
          this.create(r.View, {}, 'view').el,
          {tag: '.moods-previous <<', events: {
            click: function(e) {
              if (this.current !== 'cover' && this.current) {
                this.setView(this.current - 1);
              }
            }.bind(this)
          }},
          {tag: '.moods-next >>', events: {
            click: function(e) {
              if (this.current !== 'cover' && this.current < this.pages.length - 1) {
                this.setView(this.current + 1);
              }
            }.bind(this)
          }},
        ]
      }
    },

    '+init': function() {
      this.topbar.setResources(this.getMapResources());
      this.setView('cover');
    },

  /*Page Managing*/
    addPage: function(model, index) {
      this.pages.splice(index || 0, 0, model);
      this.leftbar.addPage(model, index);
    },

    editPage: function(model, options) {
      for (var i = 0, len = this.pages.length; i < len; i++) {
        if (model.id === this.pages[i].id) {
          for (var j in options) {
            if (this.pages[i][j]) this.pages[i][j] = options[j];
          }
          return ;
        }
      }
    },

    removePage: function(model) {
      for (var i = 0, len = this.pages.length; i < len; i++) {
        if (model.id === this.pages[i].id) {
          this.pages.splice(i, 1);
          return ;
        }
      }
    },

    setPageIndex: function(prevIndex, newIndex) {
      this.pages.splice(newIndex, 0, this.pages.splice(prevIndex, 1)[0]);
    },

    setView: function(pageIndex) {
      if (pageIndex === 'cover') {
        this.current = -1;
        this.view.setCurrent(this.cover)
      } else {
        this.current = pageIndex;
        this.view.setCurrent(this.pages[pageIndex]);
      }
    },

    uploadResources: function() {
      ;
    }

  });

  return Moods;

});
