var img = new Image();
img.crossOrigin = 'anonymous';
img.src = 'imgs/nature.jpg';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

img.onload = function () {
	ctx.drawImage(img, 0, 0);
};

var original = function () {
	ctx.drawImage(img, 0, 0);
};

var media = function (pixels, size, colors) {

}

var sobel = function () {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	gradient_internal(imageData, [1, 2, 1]); // Apply Sobel operator
	ctx.putImageData(imageData, 0, 0);
}

/**
* @param data - input pixels data
* @param idx - the index of the central pixel
* @param w - image width (width*4 in case of RGBA)
* @param m - the gradient mask (for Sobel=[1, 2, 1])
*/
function conv3x(data, idx, w, m){
	return (m[0]*data[idx - w - 4] + m[1]*data[idx - 4] + m[2]*data[idx + w - 4]
		-m[0]*data[idx - w + 4] - m[1]*data[idx + 4] - m[2]*data[idx + 4 + 4]);
  }
  
  function conv3y(data, idx, w, m){
	return (m[0]*data[idx - w - 4] + m[1]*data[idx - w] + m[2]*data[idx - w + 4]
		-(m[0]*data[idx + w - 4] + m[1]*data[idx + w] + m[2]*data[idx + w + 4]));
  }
  
  
  /**
  * @param pixels - Object of image parameters
  * @param mask - gradient operator e.g. Prewitt, Sobel, Scharr, etc. 
  */
  function gradient_internal(pixels, mask)
  {
	var data = pixels.data;
	var w = pixels.width*4;
	var l = data.length - w - 4;
	var buff = new data.constructor(new ArrayBuffer(data.length));
	
	for (var i = w + 4; i < l; i+=4){
	  var dx = conv3x(data, i, w, mask);
	  var dy = conv3y(data, i, w, mask);
	  buff[i] = buff[i + 1] = buff[i + 2] = Math.sqrt(dx*dx + dy*dy);
	  buff[i + 3] = 255;
	}
	pixels.data.set(buff);
  }
  
 


var invert = function () {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		data[i] = 255 - data[i];     // red
		data[i + 1] = 255 - data[i + 1]; // green
		data[i + 2] = 255 - data[i + 2]; // blue
	}
	ctx.putImageData(imageData, 0, 0);
};

var contraste = function () {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = imageData.data;

	let contrast = 128

	var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

	for (var i = 0; i < data.length; i += 4) {
		data[i] = factor * (data[i] - 128) + 128; //red
		data[i + 1] = factor * (data[i + 1] - 128) + 128; //green
		data[i + 2] = factor * (data[i + 2] - 128) + 128; //blue
	}
	ctx.putImageData(imageData, 0, 0);
};


const inputs = document.querySelectorAll('[name=color]');
console.log(inputs)
for (const input of inputs) {
	input.addEventListener("change", function (evt) {
		switch (evt.target.value) {
			case "sobel":
				return sobel();
			case "inverted":
				return invert();
			case "median":
				return media();
			case "contrasted":
				return contraste();
			default:
				return original();
		}
	});
}



