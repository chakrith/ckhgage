/**
 * FOR store in IoT device
 * Licensed  FREE FREE FREE.
 * Date: 16/08/2015
 * @author Chakrit H.
 * @version 0.1
 */

CkhGage = function(config) 
{ 
  
 // alert('function(config) ');
  if (!config.id) {alert("Missing id parameter for gauge!"); return false;} 
  if (!document.getElementById(config.id)) {alert("No element with id: \""+config.id+"\" found!"); return false;} 
    // configurable parameters

  this.config = 
  {

    id : config.id,
	title : (config.title) ? config.title : "",
    value : (config.value) ? config.value : 80,
	min : (config.min) ? config.min : 0,
    max : (config.max) ? config.max : 100,

	gage_w_radio : (config.gage_w_radio) ? config.gage_w_radio : 20,
	r_arc_out : (config.r_arc_out) ? config.r_arc_out : 120,
	r_arc_in : (config.r_arc_in) ? config.r_arc_in : 60,


	line_color : (config.line_color) ? config.line_color : "#3399cc",

	//"font-family:Arial; font-size:50px;";  // //'25px Arial'; //'30pt Calibri';
	title_font_style : (config.title_font_style) ? config.title_font_style : "Arial",
	title_font_size : (config.title_font_size) ? config.title_font_size : "25",
	title_font_color : (config.title_font_color) ? config.title_font_color : "#000066",

	fill_gradient_color_start : (config.fill_gradient_color_start) ? config.fill_gradient_color_start : '#00ccff',
	fill_gradient_color_stop : (config.fill_gradient_color_stop) ? config.fill_gradient_color_stop : '#000066',

	value_font_style : (config.value_font_style) ? config.value_font_style : "Arial",
	value_font_size : (config.value_font_size) ? config.value_font_size : "42",
	value_font_color : (config.value_font_color) ? config.value_font_color : '#000066',
	value_sign : (config.value_sign) ? config.value_sign : "",

	label : (config.label) ? config.label : "time / sec",
	label_font_style : (config.label_font_style) ? config.label_font_style : "Arial",
	label_font_size : (config.label_font_size) ? config.label_font_size : '16',
	label_font_color : (config.label_font_color) ? config.label_font_color : "#000066",

	minmax_font_style : (config.minmax_font_style) ? config.minmax_font_style : "Arial",
	minmax_font_size : (config.minmax_font_size) ? config.minmax_font_size : '16',
	minmax_font_color : (config.minmax_font_color) ? config.minmax_font_color : "#000066",

	w : 0,
    h : 0,

	centerX : 0,
    centerY : 0,


	title_font_height : -1,
	value_font_height : -1

  }; // End Config
  
  


  //alert("config.title_font_height:"+config.title_font_height+" config.value_font_height:"+config.value_font_height);

  // overflow values
  if (config.value > this.config.max) this.config.value = this.config.max; 
  if (config.value < this.config.min) this.config.value = this.config.min;
  this.originalValue = config.value;
  

  // canvas
  this.canvas = document.getElementById(this.config.id);

  this.config.w = this.canvas.width;
  this.config.h = this.canvas.height;

  this.config.centerX =  this.config.w /2;
  this.config.centerY = this.config.h * 85 /100;


  var auto = true;
  if(config.value) 
  {
	 if(config.auto == 'False' || config.auto == 'false')
		auto = false;
  }


  if(auto)
  {

	  this.config.r_arc_out = parseInt(this.config.w * 0.8 / 2);
	  this.config.r_arc_in = parseInt(this.config.r_arc_out * (100-this.config.gage_w_radio) / 100);


	   var ctx = this.canvas.getContext("2d");
	   var fontsize;
	   // CONFIG value_font_size
	   var maxspec = this.config.r_arc_in * 2 * 6 / 10 ;
	   for (fontsize = 100; fontsize > 8; fontsize--) 
	   {
		  ctx.font = fontsize+"px "+this.config.value_font_style;
		  var w = ctx.measureText(this.config.max+this.config.value_sign).width;
		  if(w < maxspec) break;
	   }
	   this.config.value_font_size = fontsize;
	   var maxH = this.config.r_arc_in* 8/10 ;
	   for (fontsize = this.config.value_font_size; fontsize > 5; fontsize--) 
	   {
		  var h =  determineFontHeight("font-family:"+this.config.value_font_style+"; font-size:"+fontsize+"px;"); 
		  if(h < maxH) break;
	   }
	   this.config.value_font_size = fontsize;
	   //alert("this.config.value_font_size:"+this.config.value_font_size);

	   //alert("this.config.value_font_size:"+this.config.value_font_size);


	   
	   // CONFIG minmax_font_size
	   var maxspec = this.config.r_arc_out - this.config.r_arc_in;
	   for (fontsize = 24; fontsize > 5; fontsize--) 
	   {
		  ctx.font = fontsize+"px "+this.config.minmax_font_style;
		  var w = ctx.measureText(this.config.max).width;
		  if(w < maxspec) break;
	   }
	   this.config.minmax_font_size = fontsize;
	  //alert("this.config.minmax_font_size:"+this.config.minmax_font_size);


	  // CONFIG label_font_size
	   var maxspec = this.config.r_arc_in * 2 * 6 / 10;
	   for (fontsize = 48; fontsize > 5; fontsize--) 
	   {
		  ctx.font = fontsize+"px "+this.config.label_font_style;
		  var w = ctx.measureText(this.config.label).width;
		  if(w < maxspec) break;
	   }
	   this.config.label_font_size = fontsize;
	  //alert("this.config.label_font_size:"+this.config.label_font_size);


	   // CONFIG title_font_size
	   var maxH = Math.min(this.config.w*1/10,  this.config.r_arc_in*4/10 );
	   for (fontsize = 48; fontsize > 5; fontsize--) 
	   {
		  var h =  determineFontHeight("font-family:"+this.config.title_font_style+"; font-size:"+fontsize+"px;"); 
		  if(h < maxH) break;
	   }
	   this.config.title_font_size = fontsize;
	  //alert("this.config.title_font_size:"+this.config.title_font_size);

	  this.config.title_font_height = determineFontHeight("font-family:"+this.config.title_font_style+"; font-size:"+this.config.title_font_size+"px;"); //var style = "font-family: " + family + "; font-size: " + size + ";";
	  this.config.title_font_height = this.config.title_font_height*14/10;
	  this.config.value_font_height = determineFontHeight("font-family:"+this.config.value_font_style+"; font-size:"+this.config.value_font_size+"px;"); 
	} // end auto config

}



// refresh gauge level
CkhGage.prototype.refresh = function(at_value) 
{
	//alert(" refresh  this.canvas:"+ this.canvas);
	//animate(c, value, val);
	value = 80;
	this.ckhgraph(this.canvas,value, at_value);
    // alert(val);
};


CkhGage.prototype.ckhgraph = function(canvas, value, at_value)
{
	//alert("ckhgraph()  value:"+value+"  at_value:"+at_value +"  canvas:"+ canvas);
	
	var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);



	//var value = 80; 
	var r_value = this.config.max-at_value;
	r_value = -1*r_value*Math.PI/ this.config.max;
	//alert("r_value:"+r_value);

	var centerX = this.config.centerX;
    var centerY = this.config.centerY;


	//alert("centerX : centerY   "+centerX+" : "+centerY);

	// DRAW title
	ctx.beginPath();
	//ctx.strokeStyle = title_font_color; //'#000000';
	ctx.font = this.config.title_font_size+"px "+this.config.title_font_style; //'25px Arial'; //'30pt Calibri';
    // textAlign aligns text horizontally relative to placement
    ctx.textAlign = 'center';
    // textBaseline aligns text vertically relative to font style
    ctx.textBaseline = 'top'; // 'buttom'; //'top'; //'middle';
    ctx.fillStyle = this.config.title_font_color;
	ctx.fillText(this.config.title,centerX,centerY - this.config.r_arc_out - this.config.title_font_height);
	ctx.stroke();


	//beginPath();
	//arc(x,y,r,start,stop)



	// FILL 
	if( at_value != this.config.min )
	{
		ctx.beginPath();
		// Create gradient
		var grd = ctx.createLinearGradient(0,0,200,0);  //(0,0,200,0);
		// Create gradient
		//var grd = ctx.createRadialGradient(75,50,5,90,60,100);
		grd.addColorStop(0,this.config.fill_gradient_color_start);
		grd.addColorStop(1,this.config.fill_gradient_color_stop);
		ctx.arc(centerX,centerY-1,this.config.r_arc_out -1,Math.PI,r_value);
		ctx.fillStyle = grd;// 'green';
		ctx.lineTo(centerX,centerY-1);
		ctx.fill();
		//ctx.lineWidth = 1;
		//ctx.strokeStyle = '#003300';
		ctx.stroke();
	}

	// DRAW BASE LINE
	ctx.fillStyle = '#ffffff';
	ctx.strokeStyle = this.config.line_color;
	ctx.beginPath();
    ctx.arc(centerX,centerY,this.config.r_arc_out,Math.PI,0);
	ctx.stroke();

	ctx.beginPath();
    ctx.arc(centerX,centerY,this.config.r_arc_in,Math.PI,0);
	ctx.fill();
	//ctx.lineWidth = 1;
	//ctx.strokeStyle = '#003300';
	ctx.stroke();


	
	ctx.beginPath();
	ctx.moveTo(centerX-this.config.r_arc_out,centerY);
	ctx.lineTo(centerX-this.config.r_arc_in,centerY);
	ctx.fillStyle = '#000000';
	ctx.stroke();


	//alert("centerX : this.config.r_arc_in   "+centerX+"  :  "+this.config.r_arc_in +"   this.config.r_arc_out:"+this.config.r_arc_out+"  centerY:"+centerY);
	//alert("(200+this.config.r_arc_out):"+(200+this.config.r_arc_out));
	ctx.beginPath();
	ctx.moveTo(centerX+this.config.r_arc_in, centerY);
	ctx.lineTo(centerX+this.config.r_arc_out, centerY);
	ctx.fillStyle = '#000000';
	ctx.stroke();


	// DRAW VALUE
	ctx.beginPath();
	//ctx.strokeStyle = '#000000';
	ctx.font =  this.config.value_font_size+"px "+this.config.value_font_style; //'30px Arial'; //'30pt Calibri';
    // textAlign aligns text horizontally relative to placement
    ctx.textAlign = 'center';
    // textBaseline aligns text vertically relative to font style
    ctx.textBaseline = 'top'; //'buttom'; //'top'; //'middle';
    ctx.fillStyle = this.config.value_font_color;//'black';
	ctx.fillText(at_value+this.config.value_sign,centerX,centerY-this.config.value_font_height); //
	ctx.stroke();


	// DRAW VALUE  DESC
	ctx.beginPath();
	//ctx.strokeStyle = title_font_color; //'#000000';
	ctx.font = this.config.label_font_size+"px "+this.config.label_font_style; //'25px Arial'; //'30pt Calibri';
    // textAlign aligns text horizontally relative to placement
    ctx.textAlign = 'center';
    // textBaseline aligns text vertically relative to font style
    ctx.textBaseline = 'buttom'; // 'buttom'; //'top'; //'middle';
    ctx.fillStyle = this.config.label_font_color;
	ctx.fillText(this.config.label,centerX,centerY - 3);
	ctx.stroke();

	// DRAW MIN MAX
	ctx.beginPath();
	ctx.font =  this.config.minmax_font_size+"px "+this.config.minmax_font_style; //'30px Arial'; //'30pt Calibri';
    // textAlign aligns text horizontally relative to placement
    ctx.textAlign = 'center';
    // textBaseline aligns text vertically relative to font style
    ctx.textBaseline = 'top'; //'top'; //'middle';
    ctx.fillStyle = this.config.minmax_font_color;
	ctx.fillText(this.config.min, centerX-this.config.r_arc_out + (this.config.r_arc_out-this.config.r_arc_in)/2 ,centerY+2);
	//ctx.beginPath();
	ctx.fillText(this.config.max, centerX+this.config.r_arc_out - (this.config.r_arc_out-this.config.r_arc_in)/2 ,centerY+2);
	ctx.stroke();

	//var ctx = c.getContext("2d");
	//ctx.arc(0,0,100,0,2*Math.PI);
	//ctx.stroke();S

}




//**********************************************


var determineFontHeight = function(fontStyle) 
{
  var body = document.getElementsByTagName("body")[0];
  var dummy = document.createElement("div");
  var dummyText = document.createTextNode("M");
  dummy.appendChild(dummyText);
  dummy.setAttribute("style", fontStyle);
  body.appendChild(dummy);
  var result = dummy.offsetHeight;
  body.removeChild(dummy);
  return result;
};


function getRandomInt (min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}    

