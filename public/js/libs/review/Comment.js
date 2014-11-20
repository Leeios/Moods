sand.define('Review/Comment', [
  'Seed',
  'Review/Canvas/CanvasArea',
  'prettyDate'
], function(r) {
/**/
  function placeCaretAtEnd(el) {
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

/**/
var Comment = r.Seed.extend({

  tpl: function() {
    return {
      tag: ".comment.usual",
      children: [
        ['.comment-up.usual', [
          { tag: 'span.comment-name', attr: {}, as: 'elName', innerHTML: this.author + '&nbsp'},
          { tag:"span.comment-txt", as: 'elDiv',
          events: {
            keydown: function(e) {
              if (e.keyCode === 13) {
                this.valid();
                this.onCreate();
                return false;
              }
            }.bind(this)
          }},
        ]],
        ['.comment-down', [
          { tag: ".comment-info.comment-right", as: 'infoCom', children: [
            { tag:".comment-button.button", as: 'createEl', innerHTML: 'Create', events: {
              click: function(){ this.valid(); this.onCreate(); }.bind(this)
            }},
            { tag:".comment-button.button R", as: 'replyEl', events: {
              click: this.onReply.bind(this)
            }},
            { tag:".comment-button.button E", as: 'editEl', events: {
              click: function(){
                if (this.elDiv.isContentEditable) { this.valid(); this.edit();}
                else { this.elDiv.setAttribute('contenteditable', true); this.preValid(); this.switchEdit(); }
              }.bind(this)
            }},
            { tag:".delete-button.button X", as: 'removeEl', events: {
              click: function(){ this.onRemove(this.id); }.bind(this)
            }},
            { tag: '.comment-date', as: 'timeDiv'}
          ]}
        ]]
    ]}
  },

  options: function() {
    return {
      id: 0,
      mainID: 0,
      parentID: 0,
      txt: '',
      onCreate: function() { console.log('create is not available on this element'); },
      onRemove: function() { console.log('remove is not available on this element'); },
      onReply: function() { console.log('reply is not available on this element'); },
      y: 0,
      x: 0,
      bpPosition: [0, 0],
      areas: [],
      author: 'unnamed',
      color: '',
      date: new Date().getTime()
    }
  },

  '+init': function () {

    this.infoCom.innerHTML = '';
    this.refreshDate();
    /*HARDCODE*/
    // this.infoCom.appendChild(this.createEl);
    // this.infoCom.appendChild(document.createTextNode(' - '))
    // this.infoCom.appendChild(this.removeEl);
    // this.infoCom.appendChild(this.timeDiv);
    this.elDiv.setAttribute('contenteditable', true);
  },

  valid: function(newDate) {

    this.txt = this.elDiv.innerHTML;
    this.elDiv.setAttribute('contenteditable', false);
    this.switchEdit();
    this.date = newDate || new Date().getTime();

    /*just some text ...'''code here"""some other text...*/
    this.elDiv.innerHTML = this.txt.replace(/<div>/g, '').replace(/<\/div>/g, '\n').replace(/<br>/g, '\n');
  },

  preValid: function() {
    this.elDiv.innerHTML = this.txt;
  },

  edit: function() {
    this.query('dp').comments.one(function(e) { return this.id === e.id }.bind(this)).edit({'txt': this.txt, date: this.date});
  },

  focus: function() {
    placeCaretAtEnd(this.elDiv);
  },

  setAtt: function(data) {
    this.color = data.color;
    this.setAuthor(data.author);
    this.txt = data.txt;
    this.date = data.date;
    this.y = data.y;
    this.x = data.x;
    this.bpPosition = data.bpPosition;
    this.preValid();
    this.valid(data.date);
  },

  switchEdit: function() {
    this.infoCom.innerHTML = '';
    if (this.elDiv.isContentEditable) {
      this.infoCom.appendChild(this.editEl);
    } else {
      if (this.replyEl) {
        this.infoCom.appendChild(this.replyEl);
        this.infoCom.appendChild(document.createTextNode(' - '))
      }
      this.infoCom.appendChild(this.removeEl);
      this.infoCom.appendChild(document.createTextNode(' - '))
      this.infoCom.appendChild(this.editEl);
    }
    this.focus();
    // this.infoCom.appendChild(this.timeDiv);
  },

  setAuthor: function(author) {
    this.author = author;
    this.elName.innerHTML = this.author + '&nbsp';
    // this.elName.style.color = this.color;
  },

  refreshDate: function() {
    this.timeDiv.innerHTML = r.prettyDate(this.date);
  },

  getData: function() {
    return { id: this.id, parentID: this.parentID, mainID: this.mainID, txt: this.txt,
      author: this.author || this.getAuthorName(), y: this.y, x: this.x,
      color: this.color, areas: this.getAreas(), date: this.date, bpPosition: this.bpPosition};
  },

  getAreas: function() {
    if (!this.areas) { return ;}
    var tmpAreas = [];
    for (var i = 0, len = this.areas.length; i < len; i++) {
      tmpAreas.push(this.areas[i].getArea());
    }
    return tmpAreas;
  },

  getAuthorName: function() {
    return 'unnamed';
  },

  getAuthorColor: function() {
    return ['#fffbbe', '#ffbfbf', '#bfffc4'][Math.floor(Math.random()*3)];
  }

});
return Comment;
});
