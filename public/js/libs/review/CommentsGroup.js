sand.define('Review/CommentsGroup', [
  'Seed',
  'DOM/toDOM',
  'DOM/handle',
  'Review/Library',
  'Review/Comment',
  'Review/Canvas/CanvasArea'
], function(r) {

var CommentsGroup = r.Seed.extend({

  tpl: function() {
    return {
      tag: '.group-comment', children: [
        ['.wrap-picto', [
          {tag: '.pin-picto', as: 'pinPicto'}
        ]],
        {tag: '.wrap-comments.usual', as: 'wrap', children: [
          this.create(r.Comment, {
            id: this.id,
            mainID: this.mainID,
            author: 'Me',
            onCreate: this.onCreate.bind(this),
            onRemove: this.onRemove.bind(this),
            onReply: this.addReply.bind(this)
          }, 'main').el
        ]}
      ], events: {
        mouseover: this.highStyle.bind(this),
        mouseout: this.usualStyle.bind(this),
        click: this.focusCom.bind(this)
      }
    }
  },

  options: function() {
    return {
      id: 0,
      mainID: 0,
      tmpReply: null,
      x: 0,
      y: 0,
      areas: [],
      ctx: null,
      replies: [],
      collapseEl: null,
      //HARDCODE
      colorTab: ['#fffbbe', '#ffbfbf', '#bfffc4'],
      color: Math.floor(Math.random()*3),
      onCreate: function() {console.log('create is not available on this element')},
      onRemove: function() {console.log('remove not available on this element');}
    }
  },

  '+init': function() {

    /*Set com color*/
    this.main.author = this.main.getAuthorName();
    this.main.color = this.main.getAuthorColor();
    this.main.x = this.x;
    this.main.y = this.y;
    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
    this.setAreas(this.areas, this.ctx);

    this.wrap.style['border-color'] = this.main.color;
    this.pinPicto.style['border-color'] = this.main.color;

    /*Set events*/
    this.query('dp').comments.on('insert', this.setReply.bind(this), this);
    this.query('dp').comments.on('edit', this.editCom.bind(this), this);
    this.query('dp').comments.on('remove', this.removeReply.bind(this), this);
    this.bulletPoint();
  },

  insertMain: function() {
    this.el.remove();
    this.main.author = this.main.getAuthorName();
    this.query('dp').comments.insert(this.main.getData());
  },

  editCom: function(models, changes) {
      if (models[0].parentID == this.main.id) {
        for (var i = 0, len = this.replies.length; i < len; i++) {
          if (models[0].id === this.replies[i].id) {
            for (var att in changes) {
              this.replies[i][att] = changes[att];
            }
            this.replies[i].preValid();
            this.replies[i].valid();
          }
        }
      } else if (models[0].id == this.main.id) {
        for (var att in changes) {
          this.main[att] = changes[att];
        }
        this.main.preValid();
        this.main.valid();
      }
  },

  drawAreas: function() {
    for (var i = 0, len = this.main.areas.length; i < len; i++) {
      this.main.areas[i].draw();
    }
  },

  highStyle: function() {
    // this.el.style.zIndex = '10';
    this.fire('redraw');
    this.main.areas[0] && ((this.ctx.strokeStyle =  this.main.color) && (this.ctx.globalAlpha = 0.3));
    this.drawAreas();
    //HARDCODE
    this.main.areas[0] && (this.ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    // this.el.style.zIndex = '5';
    this.fire('redraw');
    this.drawAreas();
  },

  targetBubble: function(e) {
    this.show();
    r.Library.eventOut('click', this.el, function(){ this.hide(); }.bind(this), 2);
  },

  focusCom: function(n) {
    typeof(n) === "number" ? null : n = 1;
    if (this.el.style.paddingLeft === '-12px') { return ; }
    this.el.style.paddingLeft = '-12px';
    this.highStyle();

    var callback = function() {
      this.el.style.paddingLeft = '0px';
      this.usualStyle();
    }.bind(this);

    r.Library.eventOut('click', this.el, callback, n);
  },

  setAreas: function(areas, ctx) {
    if (ctx) {
      this.ctx = ctx;
      this.main.areas.push(this.create(r.CanvasArea, {form: 'points', points: areas, ctx: this.ctx}));
    }
  },

  setMain: function(data, ctx) {
    this.main.setAtt(data);
    this.el.style.left = this.main.x + 'px';
    this.el.style.top = this.main.y + 'px';
    for (var i = 0, len = data.areas.length; i < len; i++) {
      this.setAreas(data.areas[i], ctx);
    }
    this.wrap.style['border-color'] = this.main.color;
    this.setBP();
    this.query('dp').comments.where(function(e) { return e.parentID === this.id;
    }.bind(this)).each(function(c) { this.setReply([c]); }.bind(this));
  },

  removeGroup: function() {
    this.query('dp').comments.where(function(e){ return this.main.id == e.parentID }.bind(this))
                                            .each(function(com){ com.remove(); }.bind(this));

    this.query('dp').comments.one(function(e){ return this.main.id == e.id }.bind(this)).remove();
  },

  addReply: function(data) {/*INTERFACE*/
    if (this.tmpReply !== null) {return ;}
    this.tmpReply = this.create(r.Comment, {
      mainID: this.mainID,
      parentID: this.id,
      author: 'Me',/*Local Author*/
      onCreate: function() {
        this.tmpReply.el.remove();
        delete this.tmpReply.id;
        this.query('dp').comments.insert(this.tmpReply.getData());
        this.tmpReply = null;
      }.bind(this)
    });
    this.wrap.appendChild(this.tmpReply.el);
    this.tmpReply.focus();
    this.fire('redraw');
  },

  removeReply: function(models, op) {
    if (models[0].parentID !== this.main.id) { return ;}
    for (var i = 0, len = this.replies.length; i < len; i++) {
      if (models[0].id == this.replies[i].id) {
        this.replies[i].el.remove();
        this.replies.splice(i, 1);
        if (this.replies.length === 0 && this.collapseEl) {
          this.collapseEl.remove();
        }
        return ;
      }
    }
  },

  bulletPoint: function() {
      r.handle(this.pinPicto).drag({
        start : function (e) {

          this.pinPicto.style.position = "relative"
          console.log(this.pinPicto.style.left,$(this.pinPicto).offset().left);
          if(!this.pinPicto.oL) this.pinPicto.oL = $(this.pinPicto).offset().left;
          if(!this.pinPicto.oT) this.pinPicto.oT = $(this.pinPicto).offset().top;
          if(!this.pinPicto.line) {
            this.pinPicto.line = r.toDOM({
              tag : '.line',
              style : {
                position : "absolute",
                height : "1px",
                backgroundColor : this.main.color,
              }
            })
            $(this.pinPicto.line).insertBefore(this.pinPicto.parentNode.childNodes[0])
          }
          console.log(e.xy)
          this.pinPicto.cOffsetX = e.xy[0] - $(this.pinPicto).offset().left;
          this.pinPicto.cOffsetY = e.xy[1] - $(this.pinPicto).offset().top;
          this.pinPicto.style.left = e.xy[0] - $(document.body).scrollLeft() - this.pinPicto.oL + "px";
          this.pinPicto.style.top = e.xy[1] - $(document.body).scrollTop()- this.pinPicto.oT  + "px";
          this.pinPicto.style.pointerEvents = "none"
        }.wrap(this),
        drag : function (e) {
          this.main.bpPosition = [e.xy[0] + $(document.body).scrollLeft()- this.pinPicto.oL, e.xy[1] + $(document.body).scrollTop() - this.pinPicto.oT];
          this.pinPicto.style.left = this.main.bpPosition[0] + "px";
          this.pinPicto.style.top = this.main.bpPosition[1] + "px";
          this.pinPicto.line.style.transformOrigin = "0 0";
          this.pinPicto.line.style.transform = "rotate("+Math.atan2(parseInt(this.pinPicto.style.top)+0.5*$(this.pinPicto).height(),(parseInt(this.pinPicto.style.left)+0.5*$(this.pinPicto).width()))*180/Math.PI+"deg)";
          this.pinPicto.line.style.width = Math.sqrt(Math.pow(parseInt(this.pinPicto.style.left)+0.5*$(this.pinPicto).width(),2) + Math.pow(parseInt(this.pinPicto.style.top)+0.5*$(this.pinPicto).height(),2)) +"px";
        }.wrap(this),
        end : function (e) {
          /*edit bpPosition*/
          var com;
          com = this.query('dp').comments.one(function(e) {return e.id === this.main.id}.bind(this));
          if (com) com.edit({bpPosition: this.main.bpPosition});
          this.pinPicto.style.pointerEvents = "auto";
        }.wrap(this)
      })
  },

  setBP: function () {
    console.log('setbp')
    this.pinPicto.style.position = "relative"
    if(!this.pinPicto.oL) this.pinPicto.oL = $(this.pinPicto).offset().left;
    if(!this.pinPicto.oT) this.pinPicto.oT = $(this.pinPicto).offset().top;
    if(!this.pinPicto.line) {
      this.pinPicto.line = r.toDOM({
        tag : '.line',
        style : {
          position : "absolute",
          height : "1px",
          backgroundColor : this.main.color,
        }
      })
      $(this.pinPicto.line).insertBefore(this.pinPicto.parentNode.childNodes[0])
    }

    this.pinPicto.cOffsetX = - $(this.pinPicto).offset().left;
    this.pinPicto.cOffsetY = - $(this.pinPicto).offset().top;
    this.pinPicto.style.left = $(document.body).scrollLeft() - this.pinPicto.oL + "px";
    this.pinPicto.style.top = $(document.body).scrollTop()- this.pinPicto.oT  + "px";

    this.pinPicto.style.left = this.main.bpPosition[0] + "px";
    this.pinPicto.style.top = this.main.bpPosition[1] + "px";
    this.pinPicto.line.style.transformOrigin = "0 0";
    this.pinPicto.line.style.transform = "rotate("+Math.atan2(parseInt(this.pinPicto.style.top)+0.5*$(this.pinPicto).height(),(parseInt(this.pinPicto.style.left)+0.5*$(this.pinPicto).width()))*180/Math.PI+"deg)";
    this.pinPicto.line.style.width = Math.sqrt(Math.pow(parseInt(this.pinPicto.style.left)+0.5*$(this.pinPicto).width(),2) + Math.pow(parseInt(this.pinPicto.style.top)+0.5*$(this.pinPicto).height(),2)) +"px";

  },


  collapseCom: function() {
    if (this.collapseEl !== null) { return ;}
    this.wrap.appendChild(this.create(r.toDOM, {
      tag: '.collapse-com', innerHTML: 'Hide', events: {
        click: function() {
          if (this.replies[this.replies.length - 1].el.style.display === 'none') {
            for (var i = 0, len = this.replies.length; i < len; i++) {
              this.replies[i].show();
              this.collapseEl.innerHTML = 'Hide';
            }
          } else {
            for (var i = 0, len = this.replies.length; i < len; i++) {
              this.replies[i].hide();
              this.collapseEl.innerHTML = 'Show';
            }
          }
        }.bind(this)
      }
    }, 'collapseEl'));
  },

  refreshDate: function(now) {
    this.main.refreshDate(now);
    for (var i = 0, len = this.replies.length; i < len; i++) {
      this.replies[i].refreshDate(now);
    }
  },

  setReply: function(model, options) {
    if (model[0].parentID !== this.id) { return ; }
    this.tmpReply = this.create(r.Comment, {
      id: model[0].id,
      mainID: model[0].mainID,
      parentID: model[0].parentID,
      author: model[0].author,
      color: model[0].color,
      txt: model[0].txt,
      onRemove: function() {this.query('dp').comments.one(function(e) {return e.id === model[0].id}.bind(this)).remove()}.bind(this),
      onReply: this.addReply.bind(this)
    });
    this.tmpReply.el.style.paddingLeft = '24px';
    this.wrap.appendChild(this.tmpReply.el);
    this.tmpReply.preValid();
    this.tmpReply.valid(model[0].date);
    this.replies.push(this.tmpReply);
    this.tmpReply = null;
  }

});
return CommentsGroup;
});
