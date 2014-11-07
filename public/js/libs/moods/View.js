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
					this.create(r.Case,{ width : 55, height : 27, imgSrc : this.logoSrc },'logoCase').el,
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
				this.create(r.Case,{ width : 400, height : 400, imgSrc : this.src },'imgCase').el
				]
			},this.scope);

			if(this.type === "stories"){
				this.el.appendChild(this.create(r.BP,null,'comments').el);
			}
		}
	})
})