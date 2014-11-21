sand.define('Moods/Resource', [
	'Seed',
	'DOM/handle',
	'DOM/toDOM',
], function(r) {

		Function.prototype.curry = function () {
		var self = this;
		var args = Array.prototype.slice.call(arguments);
		return function () {
			return self.apply([], args.concat(Array.prototype.slice.call(arguments)));
		};
	}

	var ResourceSeed = r.Seed.extend({

		'options': function () {
			return {
				id: 0
			}
		},

		'+init' : function(input) {

			this.el = r.toDOM({
				tag : '.resource',
				children : [
					{
						tag : '.picto',
						style : {
							pointerEvents : "none",
							backgroundImage : 'url(' + input.src + ')',
						}
					},
					{
						tag : '.label ' + (input.title || "No title"),
						style : {
							pointerEvents : "none",
						}
					}
				],
				style : {
					position : "relative",
				},
				events: {
					click: function(e) {
						console.log('Fire set page to resource id ' + this.id);
				}.bind(this)}
			});

			this.src = input.src;

			$(this.el).hover(function () { this.el.className = "resource hovered";}.bind(this),function () { this.el.className = "resource";}.bind(this))

			this.handle = r.handle(this.el);

			this.handle.drag({
				start : function (e){
					e.preventDefault();

					this.buffEl = this.el.cloneNode(true);
					$('.moods')[0].appendChild(this.buffEl);
					this.buffEl.style.position = "absolute";
					this.buffEl.style.pointerEvents = "none";
					this.fParent = this.el.parentNode;
					this.sIndex = [].concat.apply([],this.el.parentNode.childNodes).indexOf(this.el);
					//this.el.style.position = "absolute";

					if(!this.hintDiv) this.hintDiv = document.createElement('div');
					/*this.hintDiv.style.width = "1px";
					this.hintDiv.style.height = "66px";
					this.hintDiv.style.cssFloat = "left";
					this.hintDiv.style.backgroundColor = "#B5302b";
					this.hintDiv.style.marginRight = "-1px";*/

					this.sL = this.el.style.left;
					this.sT = this.el.style.top;
					this.oL = /*$(this.el.parentNode)*/$('.moods').offset().left;
					this.oT = /*$(this.el.parentNode)*/$('.moods').offset().top;
					this.width = $(this.el).width();
					this.height = $(this.el).height();

					this.sIndex = Array.prototype.slice.call(this.el.parentNode.childNodes).indexOf(this.el);


					this.cOffsetX = e.xy[0] - $(this.el).offset().left;
					this.cOffsetY = e.xy[1] - $(this.el).offset().top;

					this.buffEl.style.left = e.xy[0] - this.oL /*+ $(document.body).scrollLeft()*/ - this.cOffsetX + "px";
					this.buffEl.style.top = e.xy[1] - this.oT  /*+ $(document.body).scrollTop()*/ - this.cOffsetY  + "px";

					this.el.style.pointerEvents = "none";
				}.wrap(this),
				drag : function (e) {


					this.buffEl.style.left = e.xy[0] - this.oL /*+ $(document.body).scrollLeft()*/ - this.cOffsetX + "px";
					this.buffEl.style.top = e.xy[1] - this.oT /*+	$(document.body).scrollTop()*/ - this.cOffsetY + "px";

				}.wrap(this),
				end: function (e) {
					this.hint(e,this.hintDiv);
					if(this.hintDiv.parentNode && this.hintDiv.parentNode.getAttribute("side") == "leftbar" && this.fParent.getAttribute("side") != "leftbar") {

						var dropIndex = [].concat.apply([],this.hintDiv.parentNode.childNodes).indexOf(this.hintDiv);
						this.hintDiv.parentNode.onResourceDropped(this.id || "no Id",dropIndex);

					} else if (this.hintDiv.parentNode && this.hintDiv.parentNode.getAttribute("side") == "leftbar" && this.fParent.getAttribute("side") == "leftbar"){
						/*Au lieu de renvoie 1-1 il renvoie 1-4*/
						var dropIndex;

						dropIndex = [].concat.apply([],this.hintDiv.parentNode.childNodes).indexOf(this.hintDiv); //Index d'insertion
						this.hintDiv.parentNode.onResourceSwaped(this.sIndex, dropIndex);

					} else if(e.target.className == 'case') e.target.refresh(this.src);

					if(this.hintDiv.parentNode) this.hintDiv.parentNode.removeChild(this.hintDiv);
					$('.moods')[0].removeChild(this.buffEl);

					this.el.style.pointerEvents = "auto"
					this.el.style.left = null;
					this.el.style.top = null;
				}.wrap(this)
			});

			this.handle.on('click', this.fire.bind(this).curry('click'), this);
		},

		hint : function (e,elem) {
			var next = document.elementFromPoint(e.xy[0],e.xy[1]);
			if (!next) return;
			if(next.getAttribute("dropzone")) {
				next.appendChild(elem);
				return next;
			} else if (next.parentNode.getAttribute("dropzone")){
				e.xy[1] - $(next).offset().top <  parseInt($(next).height())*0.5 ? $(elem).insertBefore($(next)) : $(elem).insertAfter($(next));
				return next.parentNode;
			}

			return null;
		}

	})
		return ResourceSeed
});
