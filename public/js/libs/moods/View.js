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
      console.log("Set model:\n", model);
      if (!model) return ;
      this.imgContainer.innerHTML = '';
      if (model.el) this.imgContainer.appendChild(model.el);
      else {
        var size = this.calculatePosition();
        this.imgContainer.appendChild(r.toDOM({
          tag: '.moods-view-img',
          style: 'background-image:url(' + model.src + ');left:' + size[0] + ';top:' + size[1] +
                    ';width:' + size[2] + ';height:' + size[3] + ';'
        }));
      }
      this.imgContainer.appendChild(r.toDOM({
        tag: '.moods-view-comment ' + model.comment
      }));
    },


    calculatePosition: function(size) {
      console.log(this.el)/*BUGBUGBUG*/
      var size = size || [300, 300];
      var result = [0, 0, size[0], size[1]];
      /*result = 0: x/left , 1: y/top , 2: width , 3: height*/
      var ratioSrc = result[3] / result[2];
      var ratioCase = this.el.clientHeight / this.el.clientWidth;

      if (ratioSrc < ratioCase) {/*SWITCH BOOLEAN TO FILL OR MARGIN*/
        result[3] = this.el.clientHeight[1];
        result[2] = result[3] / ratioSrc;
        result[0] = -(result[2] - this.el.clientWidth) / 2;
      } else {
        result[2] = this.el.clientWidth;
        result[3] = result[2] * ratioSrc;
        result[1] = -(result[3] - this.el.clientHeight[1]) / 2;
      }
      return result;
    },


  });

  return View;

});
