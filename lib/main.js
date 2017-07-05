var processor = {};
  processor.doLoad = function doLoad() {
            this.mouseDownX = 0;
            this.mouseDownY = 0;
            this.elemClicked;
            this.rect;
            this.arrow;
            this.stop = 0;

    this.video = document.getElementById('video');
    this.computeSize();
//    this.c1 = document.createElement('canvas');
//    this.ctx1 = this.c1.getContext('2d');
    this.svg = document.getElementById('svg_paper');
    var self = this;
   // Getting the previously saved data
    
   var saveData = $.ajax({
      type: 'GET',
      dataType : "application/json",
      url: "/rjson",
      success: function(resultData) {
        console.log(resultData);
        if (resultData) {
        self.result = JSON.parse(resultData); 
        console.log(self.result); 
   self.timeval = self.getTime(self.result.json);
        console.log(self.timeval);
      if ( self.timeval ) self.stop = 1;
     } 
   }
});
//   if( self.result)

    this.video.addEventListener('timeupdate', function() {
      console.log(this.currentTime);
      console.log(self.timeval);
      console.log(self.timeval);
      if(self.stop && self.timeval && this.currentTime >= self.timeval) {
        this.pause();
        self.stop = 0;
        self.createShapes();
        self.fromJSON(self.result.json);
    }
  });

    this.video.addEventListener('pause', function() {
        self.computeFrame();
      },false);

      this.video.addEventListener('playing', function() {
      self.remove('#btn');
      setTimeout(function() {
      self.paper.clear();
      },1);
      $('.userinput').remove();

      },false);
 
  },

processor.computeSize = function computeSize() {
   //     self.width = self.video.width ;
   //     self.height = self.video.height ;
  	var w = this.video.offsetWidth;
  	var h = this.video.offsetHeight;
  	this.width = w;
  	this.height =h - 30;
     console.log("Creating the size" + this.width +" "+ this.height);
       

},

processor.createCanvas = function createCanvas() {
     console.log("Creating the paper" + this.width +" "+ this.height);
     this.paper = Raphael("svg_paper", this.width, this.height);
},

processor.createShapes = function createShapes() {
       console.log(this.paper);
       if ( this.paper == undefined ) {
         this.createCanvas();
      }
       var element = this.paper.path("M" + 0 + " " + 0);
         element = this.paper.rect(0, 0, 0, 0);
             element =this.paper.text(0, 0,"");

}


processor.computeFrame = function computeFrame() {
    this.currentTime = this.video.currentTime;
     this.createCanvas();
     this.remove('#btn');
	this.createButton();

    return;
  },

processor.remove = function remove(element) {
    console.log(element);
    var el = document.querySelector(element );
    if (el != undefined  &&  el != null ) {
    console.log(el);
    el.parentNode.removeChild( el );
    }
},

processor.createButton = function createButton() {
   this.buttons = " <div id='btn' ><input id='arrow' value='Arrow' type='button'/> <input id='rect' value='Rect' type='button'/> <input id='tex' value='Comment' type='button'/> <input id='clr' value='Clear All' type='button'/> <input id='save' value='Save' type='button'/> </div>";
  var elem = $(this.buttons); 
  $("#dv").prepend(elem);
     var _self = this;
    // Rect button click
            $("#rect").click(function (e) {
                $('#svg_paper').unbind('mousedown');
                $('#svg_paper').unbind('mousemove');
                $('#svg_paper').unbind('mouseup');

                $("#svg_paper").mousedown(function (e) {
    // Prevent text edit cursor while dragging in webkit browsers
                    e.originalEvent.preventDefault();

                    var offset = $("#svg_paper").offset();
                    _self.mouseDownX = e.pageX - offset.left;
                    _self.mouseDownY = e.pageY - offset.top;

                    _self.rect = _self.DrawRectangle(_self.mouseDownX, _self.mouseDownY, 0, 0);                    

                    $("#svg_paper").mousemove(function (e) {
                        var offset = $("#svg_paper").offset();
                        var upX = e.pageX - offset.left;
                        var upY = e.pageY - offset.top;

                        var width = upX - _self.mouseDownX;
                        var height = upY - _self.mouseDownY;
                        _self.rect.attr({ "width": width > 0 ? width : 0,
                            "height": height > 0 ? height : 0 });

                    });


                });

                $("#svg_paper").mouseup(function (e) {
                    $('#svg_paper').unbind('mousemove');
                    var BBox = _self.rect.getBBox();
                    console.log(BBox.width + " - " + BBox.height);

                    if (BBox.width == 0 && BBox.height == 0) _self.rect.remove();
                });

            });

// Text editor
            $("#tex").click(function (e) {
                $('#svg_paper').unbind('mousedown');
                $('#svg_paper').unbind('mousemove');
                $('#svg_paper').unbind('mouseup');

                $("#svg_paper").mousedown(function (e) {
    // Prevent text edit cursor while dragging in webkit browsers
                    e.originalEvent.preventDefault();

                    var offset = $("#svg_paper").offset();
                    _self.mouseDownX = e.pageX - offset.left;
                    _self.mouseDownY = e.pageY - offset.top;

                    _self.rect = _self.DrawText(_self.mouseDownX, _self.mouseDownY, 0, 0);                    

                    $("#svg_paper").mousemove(function (e) {
                        var offset = $("#svg_paper").offset();
                        var upX = e.pageX - offset.left;
                        var upY = e.pageY - offset.top;

                        var width = upX - _self.mouseDownX;
                        var height = upY - _self.mouseDownY;
                        console.log("height" +height+ " widht"+width);
                        _self.rect.attr({ "width": width > 0 ? width : 0,
                            "height": height > 0 ? height : 0 });
                   });


                });

                $("#svg_paper").mouseup(function (e) {
                    $('#svg_paper').unbind('mousemove');
                    var BBox = _self.rect.getBBox();
                    console.log(BBox.width + " - " + BBox.height);

                    if (BBox.width == 0 && BBox.height == 0) {
			 _self.rect.remove();
			 _self.text.remove();
                    }else {
                        _self.text.css({ "width": BBox.width > 0 ? BBox.width - 20 : 0,
                            "height": BBox.height > 0 ? BBox.height - 20 : 0 , "top" : _self.mouseDownY, "left" :_self.mouseDownX });
                 }
                });

            });



    // Arrow button click
            $("#arrow").click(function (e) {
                $('#svg_paper').unbind('mousedown');
                $('#svg_paper').unbind('mousemove');
                $('#svg_paper').unbind('mouseup');

                $("#svg_paper").mousedown(function (e) {
    // Prevent text edit cursor while dragging in webkit browsers
                    e.originalEvent.preventDefault();

                    var offset = $("#svg_paper").offset();
                    _self.mouseDownX = e.pageX - offset.left;
                    _self.mouseDownY = e.pageY - offset.top;

                    _self.arrow = _self.DrawArrow(_self.mouseDownX, _self.mouseDownY);

                    $("#svg_paper").mousemove(function (e) {
                        var offset = $("#svg_paper").offset();
                        var upX = e.pageX - offset.left;
                        var upY = e.pageY - offset.top;

                        var path = "M" + _self.mouseDownX + " " + _self.mouseDownY +
                                "L" + (upX > 0 ? upX : 0) + " " + (upY > 0 ? upY : 0);
                        _self.arrow.attr("path", path);
                    });

                });

                $("#svg_paper").mouseup(function (e) {
                    $('#svg_paper').unbind('mousemove');
                    var BBox = _self.arrow.getBBox();
                    if (BBox.width == 0 && BBox.height == 0) _self.arrow.remove();
                });

            });


    // Unbind events
            $("#unbind").click(function (e) {
                $('#svg_paper').unbind('mouseup');
                $('#svg_paper').unbind('mousemove');
                $('#svg_paper').unbind('mousedown');
            });

    // Delete rect
            $("#save").click(function (e) {
             //   $('#' + _self.elemClicked).remove();
              var json = _self.toJSON();
                _self.stop = 1;
                _self.paper.clear();
                $('.userinput').remove();
             console.log(json);

var saveData = $.ajax({
      type: 'POST',
      url: "/vjson",
      data: {json:json},
      dataType : "application/json",
      success: function(resultData) { console.log("Save Complete") }
});

//             setTimeout(function() {
 //            _self.fromJSON(json);
  //           }, 3000);
 //           });

});

            $("#clr").click(function (e) {
                _self.paper.clear();
                $('.userinput').remove();
            });
},

processor.removeButton = function removeButtion() {
   var belem = $("#btn");
   if ( belem ) $('#dv').find('div').first().remove();
 
},

processor.DrawArrow = function DrawArrow(x, y) {
                var element = this.paper.path("M" + x + " " + y);
                element.attr({
    // stroke: Raphael.getColor(),
                    stroke: "yellow",
                    "stroke-width": 4,
                    "arrow-end": "classic-medium-medium"
                });
                return element;
   },

processor.DrawRectangle = function DrawRectangle(x, y, w, h) {

                var element = this.paper.rect(x, y, w, h);
                element.attr({
                    fill: "gray",
                    opacity: .5,
                    stroke: "#F00"
                });

                $(element.node).attr('id', 'rct' + x + y);
                console.log(element.attr('x') + " - " + element.attr('y'));

                element.drag(this.move, this.start, this.up);

                element.click(function (e) {
                    this.elemClicked = $(element.node).attr('id');
                });

                return element;

    },

processor.DrawText = function DrawText(x,y,w,h) {
          var element = this.paper.rect(x, y, w, h);
                element.attr({
                    fill: "#FFF",
                    opacity: 1,
                    stroke: "#F00"
                });

                $(element.node).attr('id', 'rct' + x + y);
                console.log(element.attr('x') + " - " + element.attr('y'));

                element.drag(this.move, this.start, this.up);

                element.click(function (e) {
                    this.elemClicked = $(element.node).attr('id');
   		$('#text').show(); 
   		$('#text').focus(); 
                });
             this.text = $("<textarea id='text' class='userinput'></textarea>");
             this.text.css({"position": "absolute",  "border": "none", "display":"none", "margin": "10px", "z-index": 9005});
            $('#svg_paper').append(this.text);
             var pself = this;
            $('#text').blur(function(e) {
             pself.paper.text(pself.mouseDownX, pself.mouseDownY,$("#text").val()).attr({'text-anchor': 'start'});
            });
                return element;


},

processor.start = function start() {
    // storing original coordinates
                this.ox = this.attr("x");
                this.oy = this.attr("y");
                this.attr({
                    opacity: 1
                });
                if (this.attr("y") < 60 && this.attr("x") < 60) this.attr({
                    fill: "#f2f2f2"
                });
            }, 

    processor.move = function move(dx, dy) {

    // Move will be called with dx and dy
                if (this.attr("y") > 600 || this.attr("x") > 800) this.attr({
                    x: this.ox + dx,
                    y: this.oy + dy
                });
                else {
                    nowX = Math.min(800, this.ox + dx);
                    nowY = Math.min(600, this.oy + dy);
                    nowX = Math.max(0, nowX);
                    nowY = Math.max(0, nowY);
                    this.attr({
                        x: nowX,
                        y: nowY
                    });

                    if (this.attr("fill") != "#f2f2f2") this.attr({
                        fill: "#f2f2f2"
                    });
                }

            }, 

processor.up = function up() {
    // restoring state
                this.attr({
                    opacity: .5
                });
                if (this.attr("y") < 60 && this.attr("x") < 60) this.attr({
                    fill: "#AEAEAE"
                });
  },

processor.toJSON = function toJSON(callback) {
		var
			data,
			elements = new Array,
			paper    = this.paper
			;

		for ( var el = paper.bottom; el != null; el = el.next ) {
			data = callback ? callback(el, new Object) : new Object;

			if ( data ) elements.push({
				data:      data,
				type:      el.type,
				attrs:     el.attrs,
				transform: el.matrix.toTransformString(),
				id:        el.id
				});
		}
               // adding current time.
               elements.push({ time : this.currentTime});
             

		var cache = [];
		var o = JSON.stringify(elements, function (key, value) {
		    //http://stackoverflow.com/a/11616993/400048
		    if (typeof value === 'object' && value !== null) {
		        if (cache.indexOf(value) !== -1) {
		            // Circular reference found, discard key
		            return;
		        }
		        // Store value in our collection
		        cache.push(value);
		    }
		    return value;
		});
		cache = null;
		return o;
	},


processor.fromJSON = function fromJSON(json, callback) {
		var
			el,
			paper = this.paper
			;

		if ( typeof json === 'string' ) {

                console.log( typeof json);
		json = JSON.parse(json);
                console.log( typeof json);
              }

		for ( var i in json ) {
			if ( json.hasOwnProperty(i) ) {
                               if ( json[i].type ) { 
				console.log(json[i].type);
				el = paper[json[i].type]()
					.attr(json[i].attrs)
					.transform(json[i].transform);

				el.id = json[i].id;

				if ( callback ) el = callback(el, json[i].data);

				if ( el ) paper.set().push(el);
			}
                   }
		}
	},

processor.getTime = function getTime(json) {

        var value = 0;
                          console.log(value);
	if ( typeof json === 'string' ) {
        	json = JSON.parse(json);
            }
		for ( var i in json ) {
		  if ( json.hasOwnProperty(i) ) {
			if ( json[i].time) {
			  value = json[i].time;
                          console.log(value);
			   break;   
			}
               }

           }
          return value;

}
