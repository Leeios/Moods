sand.define('Moods/Master', [
  'Seed',
  'DOM/toDOM',
  'DataPackage/Controller->DP',
  'Moods/Bar',
  'Moods/Upload',
  'Moods/View',
  'Moods/Cover',
  'Review/ComModule'
], function(r) {

  var Moods = r.Seed.extend({

    isMediator: true,
    respondsTo: { dp: function() {return this.dp;} },

    options: function() {
      return {
        dp: new r.DP({
          data: {pages: [], resources: [], comments: []}
        }),
        pages: [],
        cover: this.create(r.Cover),
        current: null
      }
    },

    tpl: function() {
      return {
        tag: '.moods', children: [
          this.create(r.Bar, {side : "topbar"}, 'topbar').el,
          this.create(r.Bar, {side : "leftbar"}, 'leftbar').el,
          {tag: '.moods-container', as: 'container', children: [
            {tag: '.moods-container-view', as: 'containerView', children: [
              this.create(r.View, {}, 'view').el,
              {tag: '.moods-previous.moods-arrow <<', events: {
                click: function(e) {
                  if (this.current !== 'cover' && this.current) {
                    this.setView(this.current - 1);
                  }
                }.bind(this)
              }},
              {tag: '.moods-next.moods-arrow >>', events: {
                click: function(e) {
                  if (this.current !== 'cover' && this.current < this.pages.length - 1) {
                    this.setView(this.current + 1);
                  }
                }.bind(this)
              }}
            ]}
          ]}
        ]
      }
    },

    '+init': function() {
      console.log('Init Moods...');
      this.container.appendChild(this.create(r.ComModule, {attachEl: this.containerView, canvas: 'on', dp: this.dp}, 'commentsbar').el);
      console.log(this.commentsbar);
      this.topbar.el.appendChild(this.create(r.Upload, {}, 'upload').el);
      this.topbar.setResources(this.getMapResources());
      this.setView('cover');
      ['insert', 'edit', 'delete'].each(function(e) {
        this.dp.pages.on(e, function(model, options) {
          this[e + 'Page'](model, options);
        }.bind(this))
      }.bind(this));
    },

  /*Interface/ Droit d'utiliser*/
  insertPageDP: function(model) {
    /*Parse model ?*/
    this.dp.pages.insert(model);
  },
  editPageDP: function(model, options) {
    /*Parse model ?*/
    this.dp.pages.edit(model, options);
  },
  deletePageDP: function(model) {
    /*Parse model ?*/
    this.dp.pages.delete(model);
  },

  /*Page Managing*/
    insertPage: function(model, index) {
      this.pages.splice(index || this.pages.length - 1, 0, model);
      this.leftbar.insertPage(model, index);
      // this.topbar.highlight(model);
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

    deletePage: function(model) {
      for (var i = 0, len = this.pages.length; i < len; i++) {
        if (model.id === this.pages[i].id) {
          this.pages.splice(i, 1);
          return ;
        }
      }
    },

    switchIndex: function(prevIndex, newIndex) {
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

    getMapResources: function() {
      return null;
    },

    uploadResources: function() {
      ;
    }

  });
  return Moods;
});
