$('#fancy-text').keyup(
		function(){
			var value = $(this).val();
			$('.headline').text(value);
		}
	);

$('form').submit(function(e){
		e.preventDefault;
    return false;
});

// Split the text into lines for the canvas drawing
function text2lines(txt, ctx_canvas, font_size, font_family, max_width){
	ctx_canvas.font="500 "+font_size+"px "+font_family;  //font weight 500, since canvas renders thicker fonts
	words = txt.split(" ");
	current_txt = "";
	previous_txt = "";
	txt_in_lines = [];//An empty array
	n_words = words.length;
	for (var i = 0; i < n_words; i++) {
		current_txt += words[i] + " ";
		if (ctx_canvas.measureText(current_txt).width >= max_width) {
			txt_in_lines.push(previous_txt);//Add new line in array
			current_txt = words[i]+ " ";
			previous_txt = current_txt;
		}
		previous_txt = current_txt;
	}
	if (ctx_canvas.measureText(current_txt).width >= 0){
		txt_in_lines.push(current_txt); //Add the final line in array
	}
	return txt_in_lines;
}





$(document).ready(function(){
// All the color templates,
// For each background color foreground found using http://contrast-finder.tanaguru.com/
// For good contrast
	var colors_array = new Array();
	colors_array.push(["#ff1744", "#020403"]); // [bgcolor,txtColor]
	colors_array.push(["#f50057", "#040201"]);
	colors_array.push(["#d500f9", "#020304"]);
	colors_array.push(["#651fff", "#FFFFED"]);
	colors_array.push(["#3d5afe", "#fffff3"]);
	colors_array.push(["#2979ff", "#000300"]);
	colors_array.push(["#00b0ff", "#1A414F"]);
	colors_array.push(["#00e5ff", "#4F404C"]);
	colors_array.push(["#1de9b6", "#4F404C"]);
	colors_array.push(["#00e676", "#2A454F"]);
	colors_array.push(["#76ff03", "#000000"]);
	colors_array.push(["#c6ff00", "#555768"]);
	colors_array.push(["#ffea00", "#0500FE"]);
	colors_array.push(["#ffc400", "#31454F"]);
	colors_array.push(["#ffff00", "#000000"]);
//Show the colors
	table_html ='';
	for (var i = 0; i < colors_array.length; i++) {
		bgColor = colors_array[i][0];
		txtColor = colors_array[i][1];
		table_html +=`
		<td><a href="#">
			 <div style= "background-image: -webkit-linear-gradient(-45deg, ${bgColor} 70%, ${txtColor} 70%);" class="canvas-color" data-txtColor="${txtColor}" data-bgColor="${bgColor}"></div>
		</a></td>
		`;
	}

	$('.color-row').html(table_html);

/////////////////////////////////////
// Create Image
////////////////////////////////////

	$('button').on('click', function(){
		var canvas = document.getElementById('canvas');
		// Set canvas size
		canvas.height = $('.story-wrap').height();
        if (canvas.getContext) {
          var ctx = canvas.getContext('2d');
					// Color the canvas
					ctx.fillStyle = $(".story").css("background-color");
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					// Draw the cactus
					var cactus_img = new Image();
          cactus_img.src = "./img/cactus-mini.png";
          // Make sure the image is loaded first otherwise nothing will draw.
          cactus_img.onload = function(){
						x_img = (canvas.width-cactus_img.width)/2; //In center
						y_img = canvas.height-cactus_img.height - 4; //At the bottom and elevate a bit
            ctx.drawImage(cactus_img, x_img, y_img);
					}
					//Draw the text
					var txt= $('.headline').text();
					var canvas_font_size = 30;
					var max_width = $(".story").css("width"); //e.g. "300px"
					max_width =  Number(max_width.substring(0, max_width.length - 2));
					var canvas_font_family = "Gaegu";
					var lineheight = 1.15 * canvas_font_size;
					lines = text2lines(txt, ctx, canvas_font_size, canvas_font_family, max_width);
					ctx.font="500 " + canvas_font_size+"px "+canvas_font_family; //font weight 500, since canvas renders thicker fonts
					ctx.fillStyle = $(".story").css("color");
					for (var i = 0; i<lines.length; i++){
						current_linewidth = ctx.measureText(lines[i]).width;
						x_txt =  (max_width - current_linewidth)/2; //for centering
						y_txt =  10 + canvas_font_size + (i*lineheight);
						ctx.fillText(lines[i], x_txt, y_txt);
					}
				}
	});

	$('.closebox').on('click', function(){
		$('.lightbox').css("display","none");
	});

// Change color theme of canvas
	$('.canvas-color').on('click', function(){
		divbgColor = this.dataset.bgcolor;
		divtxtColor = this.dataset.txtcolor;
		$(".story").css({"background-color": divbgColor, "color": divtxtColor});
	});
});
