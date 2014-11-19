sand.define('Moods/View',['Moods/Case','DOM/toDOM','Moods/BP','Seed'], function (r) {
	var Case = r.Case;



	return r.Seed.extend({

		'+init' : function (opt) {
			this.type = opt.type || "stories"
			this.scope = {};
			this.src = opt.src || "/img/tex_00.jpg";
			this.logoSrc = opt.logoSrc || "/img/Whibo.png";

			this.el = r.toDOM({
				tag : '.view.'+this.type,
				children : [
				{
					tag : '.header',
					children : [
					this.create(r.Case,{ width : 83, height : 40	, imgSrc : this.logoSrc },'logoCase').el,
					{
						tag : '.title',
						attr : {
							contentEditable : true,
						},
						events : {
							keydown : function (e) {
								if(e.keyCode == 13) {
									return false;
								}
							}
						}
					}
					]
				},
				]
			},this.scope);

			if(this.type === "stories"){
				this.el.appendChild(this.create(r.Case,{ width : 400, height : 400, imgSrc : this.src },'imgCase').el);
				//this.el.appendChild(this.create(r.BP,null,'comments').el);
			} else if (this.type === "moods"){

				this.caseBox = r.toDOM({
					tag : '.caseBox',
					style : {
						position : "absolute",
					},
					children : [
						this.create(r.Case,{ width : 475, height : 400, fit : true, imgSrc : this.src },'imgCase').el,
						{
							tag : '.label',
							style : {
								position : "absolute"
							},
							attr : {
								contentEditable : true,
							}
						}
					]
				},this.scope)

				this.el.appendChild(this.caseBox);


				this.imgCase.on('case:imageMovedInt',function (x,y,iWidth,iHeight) {
					this.scope.label.style.left = Math.min(Math.max(x - 50,-50),parseInt(this.imgCase.el.style.width)) + 'px';
					this.scope.label.style.top =  Math.max(Math.min(y + iHeight - 35,parseInt(this.imgCase.el.style.height)-35), - 35) + 'px';
				}.bind(this));7

			}
		},
            setCurrent: function(model) {
              if (!model) return ;
              if (model.el) {
                this.cover = model.el;
                this.imgCase.el.remove();
                this.el.appendChild(model.el);
                return ;
              }
              this.cover.remove();
              this.el.appendChild(this.imgCase.el);
              this.src = model.src;
              this.imgCase.img.src = model.src;
              this.imgCase.loadCase(true);
              console.log(this.src)
            }
	})
})
