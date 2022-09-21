let img = new Image();
img.crossOrigin = "anonymous";
img.src = "imgs/king-adriano.jpg";

let canvasEsq = document.getElementById("canvas-esq");
let canvasDir = document.getElementById("canvas-dir");
let contextoRenderingEsq = canvasEsq.getContext("2d");
let contextoRenderingDir = canvasDir.getContext("2d");

/** @param {CanvasRenderingContext2D} contextoParaDesenhar */
const mostraImagemInvertida = (contextoParaDesenhar) => {
	const imageData = contextoRenderingEsq.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		data[i]     = 255 - data[i];
		data[i + 1] = 255 - data[i + 1];
		data[i + 2] = 255 - data[i + 2];
		data[i + 3] = 255;
	}
	contextoParaDesenhar.putImageData(imageData, 0, 0);
}


img.onload = function () {
	canvasEsq.width  = canvasDir.width  = img.width;
	canvasEsq.height = canvasDir.height = img.height;
	
	contextoRenderingEsq.drawImage(img, 0, 0);
	
	mostraImagemInvertida(contextoRenderingDir);
};


////// ABAIXO DAQUI SÓ LIXO QUE TEM QUE MUDAR DO LUGAR Q NOIS COPIAMOS KK
const original = () => {
	contextoRenderingEsq.drawImage(img, 0, 0);
};

const sobel = () => {
	contextoRenderingEsq.drawImage(img, 0, 0);
	const imageData = contextoRenderingEsq.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;

	gradient_internal(imageData, [1, 2, 1]); // Apply Sobel operator
	contextoRenderingEsq.putImageData(imageData, 0, 0);
}

sobel();
function gradient_internal(pixels, mask) {
	let data = pixels.data;
	let w = pixels.width*4;
	let l = data.length - w - 4;
	let buff = new data.constructor(new ArrayBuffer(data.length));

	for (let i = w + 4; i < l; i+=4){
		let dx = conv3x(data, i, w, mask);
		let dy = conv3y(data, i, w, mask);
		buff[i] = buff[i + 1] = buff[i + 2] = Math.sqrt(dx*dx + dy*dy);
		buff[i + 3] = 255;
	}
	pixels.data.set(buff);
}

/**
* @param data - input pixels data
* @param idx - the index of the central pixel
* @param w - image width (width*4 in case of RGBA)
* @param m - the gradient mask (for Sobel=[1, 2, 1])
*/
function conv3x(data, idx, w, m) {
	return (m[0]*data[idx - w - 4] + m[1]*data[idx - 4] + m[2]*data[idx + w - 4]
	-m[0]*data[idx - w + 4] - m[1]*data[idx + 4] - m[2]*data[idx + 4 + 4]);
}

function conv3y(data, idx, w, m) {
	return (m[0]*data[idx - w - 4] + m[1]*data[idx - w] + m[2]*data[idx - w + 4]
	-(m[0]*data[idx + w - 4] + m[1]*data[idx + w] + m[2]*data[idx + w + 4]));
}

const contraste = () => {
	contextoRenderingEsq.drawImage(img, 0, 0);
	const imageData = contextoRenderingEsq.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	let data = imageData.data;

	let contrast = 128

	let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

	for (let i = 0; i < data.length; i += 4) {
		data[i] = factor * (data[i] - 128) + 128; //red
		data[i + 1] = factor * (data[i + 1] - 128) + 128; //green
		data[i + 2] = factor * (data[i + 2] - 128) + 128; //blue
	}
	contextoRenderingEsq.putImageData(imageData, 0, 0);
};