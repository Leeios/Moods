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

			this.caseBox = r.toDOM({
					tag : '.caseBox',
					style : {
						position : "absolute",
					},
					children : [
						this.create(r.Case,{ width : 475, height : 400, fit : true, imgSrc : this.src },'boxCase').el,
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

			this.boxCase.on('case:imageMovedInt',function (x,y,iWidth,iHeight) {
					this.scope.label.style.left = Math.min(Math.max(x - 50,-50),parseInt(this.imgCase.el.style.width)) + 'px';
					this.scope.label.style.top =  Math.max(Math.min(y + iHeight - 35,parseInt(this.imgCase.el.style.height)-35), - 35) + 'px';
				}.bind(this));7


			if(this.type === "stories"){
				this.el.appendChild(this.create(r.Case,{ width : 355, height : 355, imgSrc : this.src },'imgCase').el);
				this.el.appendChild(this.create(r.BP,null,'comments').el);
				this.imgCase.on('case:delta', function (dx,dy) {
					for(var i = 0, n = $('.bp-commentaries .pin-picto').length; i < n; i++) {
						if($('.bp-commentaries .pin-picto')[i].previousSibling){
							$('.bp-commentaries .pin-picto')[i].style.left = parseInt($('.bp-commentaries .pin-picto')[i].style.left) + dx + 'px';
							$('.bp-commentaries .pin-picto')[i].style.top = parseInt($('.bp-commentaries .pin-picto')[i].style.top) + dy + 'px';
							$('.bp-commentaries .pin-picto')[i].previousSibling.style.transformOrigin = "0 0";
							$('.bp-commentaries .pin-picto')[i].previousSibling.style.transform = "rotate("+Math.atan2(parseInt($('.bp-commentaries .pin-picto')[i].style.top)+0.5*$($('.bp-commentaries .pin-picto')[i]).height(),(parseInt($('.bp-commentaries .pin-picto')[i].style.left)+0.5*$($('.bp-commentaries .pin-picto')[i]).width()))*180/Math.PI+"deg)";
							$('.bp-commentaries .pin-picto')[i].previousSibling.style.width = Math.sqrt(Math.pow(parseInt($('.bp-commentaries .pin-picto')[i].style.left)+0.5*$($('.bp-commentaries .pin-picto')[i]).width(),2) + Math.pow(parseInt($('.bp-commentaries .pin-picto')[i].style.top)+0.5*$($('.bp-commentaries .pin-picto')[i]).height(),2)) +"px";
						}
					}
				})
				this.imgCase.on('case:zoomFactor', function (omega,p) {
					/*for(var i = 0, n = $('.bp-commentaries .pin-picto').length; i < n; i++) {
						if($('.bp-commentaries .pin-picto')[i].previousSibling){
							$('.bp-commentaries .pin-picto')[i].style.left = (parseInt($('.bp-commentaries .pin-picto')[i].style.left)-p.x)*omega  + 'px';
							$('.bp-commentaries .pin-picto')[i].style.top = (parseInt($('.bp-commentaries .pin-picto')[i].style.top)-p.y)*omega  + 'px';
							$('.bp-commentaries .pin-picto')[i].previousSibling.style.transformOrigin = "0 0";
							$('.bp-commentaries .pin-picto')[i].previousSibling.style.transform = "rotate("+Math.atan2(parseInt($('.bp-commentaries .pin-picto')[i].style.top)+0.5*$($('.bp-commentaries .pin-picto')[i]).height(),(parseInt($('.bp-commentaries .pin-picto')[i].style.left)+0.5*$($('.bp-commentaries .pin-picto')[i]).width()))*180/Math.PI+"deg)";
							$('.bp-commentaries .pin-picto')[i].previousSibling.style.width = Math.sqrt(Math.pow(parseInt($('.bp-commentaries .pin-picto')[i].style.left)+0.5*$($('.bp-commentaries .pin-picto')[i]).width(),2) + Math.pow(parseInt($('.bp-commentaries .pin-picto')[i].style.top)+0.5*$($('.bp-commentaries .pin-picto')[i]).height(),2)) +"px";
						}
					}*/
				})
			} else if (this.type === "moods"){

				

				this.el.appendChild(this.caseBox);


				

			}
		},
            setCurrent: function(model) {
              if (!model) return ;
              if (model.el && this.type == "stories") {
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
