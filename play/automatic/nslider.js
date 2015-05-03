/***

new DoubleSlider(dom,{

	backgrounds:[
		{color:"#cc2727"},
		{color:"#bada55"},
		{color:"#2095dc"}
	],

	values:[0.1,0.9]

});

***/
function NSlider(dom,config){

	var self = this;
	self.dom = dom;
	self.backgrounds = [];
	self.sliders = [];
	self.values = config.values;

	self.draggingSliderDOM = null;
	self.draggingSliderIndex = -1;

    self.sliderCount = config.backgrounds.length;

	// Create DOM
	self.dom.className = "ds";
	for(var i=1;i<=self.sliderCount;i++){

		var dom = document.createElement("div");
		dom.className = "ds_bg";
		self.dom.appendChild(dom);
		self.backgrounds[self.sliderCount-i] = dom;

		// CSS
		dom.style.backgroundColor = config.backgrounds[self.sliderCount-i].color;
		dom.style.backgroundImage = "url("+config.backgrounds[self.sliderCount-i].icon+")";
		if(i==0) dom.style.width = "100%";

	}
	for(var i=0;i<(self.sliderCount-1);i++){
		
		var dom = document.createElement("div");
		dom.className = "ds_slider";
		self.dom.appendChild(dom);
		self.sliders.push(dom);

		// Events
		(function(dom,i,self){
			dom.onmousedown = function(){
				self.draggingSliderDOM = dom;
				self.draggingSliderIndex = i;
			};
		})(dom,i,self);

	}

	// Slider logic
	function onMouseMove(x){
	    if(self.draggingSliderDOM){
	    	var val = x/400;

	    	var index = self.draggingSliderIndex;
	    	var sliderWidth = 0;//0.025;
            var edge_l = 0;
            var edge_h = 1;
	    	if(index==0){
	    		edge_l = sliderWidth/2;
	    		edge_h = self.values[index+1]-sliderWidth;
	    	}else if(index==(self.sliderCount-1)){
	    		edge_l = self.values[index-1]+sliderWidth;
	    		edge_h = 1-sliderWidth/2;
	    	}else{
	    		edge_l = self.values[index-1]+sliderWidth;
	    		edge_h = self.values[index+1]-sliderWidth;
            }
            if(val>edge_h){
               val=edge_h;
            }else if(val<edge_l){
                val=edge_l;
            }

	    	self.values[index] = val;
	    	self.updateUI();
	    	config.onChange(self.values);

		}
	}
	function onMouseUp(){
		if(self.draggingSliderDOM){
		    self.draggingSliderDOM = null;
		    if(config.onLetGo){
		    	config.onLetGo();
		    }
		}
	}
	document.body.addEventListener("mousemove",function(event){
		var x = event.pageX - myX();
		onMouseMove(x);
	},true);
	document.body.addEventListener("touchmove",function(event){
		var x = event.changedTouches[0].clientX - myX();
		onMouseMove(x);
	},true);
	document.body.addEventListener("mouseup",onMouseUp,true);
	document.body.addEventListener("touchend",onMouseUp,true);
	var cacheX = null;
	function myX(){
		if(!cacheX) cacheX=findPos(self.dom)[0];
		return cacheX;
	}

	// UI Update
	self.updateUI = function(){

		for(var i=0;i<(self.sliderCount-1);i++){
			var slider = self.sliders[i];
			var val = self.values[i];
			slider.style.left = (400*val - 5)+"px";
		}

		var bg;
        var vals = self.values.map(function(val){
            return val*400;
        })
        
        for(var i=0; i<self.sliderCount;i++){
            bg = self.backgrounds[i];
            if(i==0){
                bg.style.width = vals[i]+"px";
            }else if(i==(self.sliderCount-1)){
                bg.style.width = (400-vals[i-1])+"px";
                bg.style.left = (vals[i-1])+"px";
            }else {
                bg.style.width = (vals[i]-vals[i-1])+"px";
                bg.style.left = (vals[i-1])+"px";
            }
        }

	};

	// INIT
	self.updateUI();
	config.onChange(self.values);


}

function findPos(obj){
    var curleft = 0;
    var curtop = 0;
    if(obj.offsetLeft) curleft += parseInt(obj.offsetLeft);
    if(obj.offsetTop) curtop += parseInt(obj.offsetTop);
    if(obj.scrollTop && obj.scrollTop > 0) curtop -= parseInt(obj.scrollTop);
    if(obj.offsetParent) {
        var pos = findPos(obj.offsetParent);
        curleft += pos[0];
        curtop += pos[1];
    }/* else if(obj.ownerDocument) {
        var thewindow = obj.ownerDocument.defaultView;
        if(!thewindow && obj.ownerDocument.parentWindow)
            thewindow = obj.ownerDocument.parentWindow;
        if(thewindow) {
            if(thewindow.frameElement) {
                var pos = findPos(thewindow.frameElement);
                curleft += pos[0];
                curtop += pos[1];
            }
        }
    }*/

    return [curleft,curtop];
}
