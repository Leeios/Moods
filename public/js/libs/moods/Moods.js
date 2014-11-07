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
              this.create(r.View, {type : "stories"}, 'view').el,
              {tag: '.moods-previous.moods-arrow <<', events: {
                click: function(e) {
                  console.log('previous view')
                  if (this.current !== 'cover' && this.current) {
                    this.setView(this.current - 1);
                  }
                }.bind(this)
              }},
              {tag: '.moods-next.moods-arrow >>', events: {
                click: function(e) {
                  console.log('next view')
                  if (this.current < this.pages.length - 1) {
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

      this.container.appendChild(this.create(r.ComModule, {attachEl: this.containerView, dp: this.dp}, 'commentsbar').el);
      this.topbar.el.appendChild(this.create(r.Upload, {complete: function(file) {
        this.dp.resources.insert({src: file.content, title: file.name});
      }.bind(this)}, 'upload').el);
      this.leftbar.on('onResourceDropped', function(data) {
        data.index--;/*DIRTY*/
        this.dp.pages.insert(data);
      }.bind(this));

      /*Listeners*/
      ['insert', 'edit', 'delete'].each(function(e) {
        this.dp.pages.on(e, function(model, options) {
          this[e + 'Page'](model, options);
        }.bind(this))
      }.bind(this));
      this.leftbar.on('resourceDrop', function(data) {
        var trueIndex = data.index || 0;
        data.index = this.pages.length;
        this.insertPageDP(data);
        this.offsetIndexPage([this.pages.length - 1], trueIndex);
        this.setView(0);
      }.bind(this));

      /*TEST*/
      // var id = this.dp.resources.insert({src: "/img/skybox/nz.jpg", title: "TEST"}).id;
      // this.dp.pages.insert({index:0, id: id});

      this.setView('cover');
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
    insertPage: function(model) {
      this.pages[model[0].index] = model[0].id;
      // this.pages.splice(model.index || this.pages.length - 1, 0, model);
    },

    editPage: function(model, options) {
      for (var i = 0, len = this.pages.length; i < len; i++) {
        if (model.id === this.pages[i].id) {
            if (options.index) this.pages[model.index] = model.id;
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

    offsetIndexPage: function (indexes) {
      var prevIndex = index[0];
      var newIndex = index[1];
      this.dp.pages.edit(
        this.dp.pages.one(function(e) {e.index === prevIndex}.bind(this)),
        {index: newIndex}
      )
      for (var i = 0, len = this.pages.length; i < len; i++) {
        this.dp.pages.where(function(e) {
          return e.index > Math.min(prevIndex, newIndex) + Math.abs(prevIndex - newIndex);
        }.bind(this)).each(function(e) {
          this.dp.pages.edit(e, {index: e.index + 1})
        }.bind(this))
      }
    },

    setView: function(pageIndex) {
      console.log('Set view: ', pageIndex, this.pages)
      if (pageIndex === 'cover') {
        this.current = -1;
        this.view.setCurrent(this.cover)
      } else {
        this.current = pageIndex;
        this.view.setCurrent(
          this.dp.resources.one(function(e) {
            return e.id === this.pages[pageIndex];
        }.bind(this)))
      }
    },

    getMapResources: function() {
      return null;
    },

    uploadResources: function() {
      ;
    },

    resourceToView : function (ressource) {
      //this.create(r.View,{ src : resources.src})
    },

  });
  return Moods;
});
