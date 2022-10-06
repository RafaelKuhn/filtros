// ################################################
// #################### CONFIG ####################
// ################################################
const imgOriginal = new Image();
imgOriginal.crossOrigin = "anonymous";

const imagens = [
	"venus.jpg",
	"adriano-rei-da-cerveja.jpg",
	"ednaldo.png",
	"nuvens-4k.jpg",
	"flora.png",
	"grayscale-angel.jpg",
	"grayscale-esqueleto.jpg",
	"grayscale-guerra.jpg",
	"ilusao-de-deriva-periferica.jpg",
	"Akiyoshi-Kitaoka.png",
	"noise-blue.jpg",
	"noise-kurama.jpg",
	"blur-menino-ney.jpg",
	"tengu-of-ashina.jpg",
	"yuv-encoding-jpeg.png",
];

const atualizaImagem = index => {
	imgOriginal.src = `imgs/${imagens[index]}`
}

atualizaImagem(0);


const filtrosPorChave = {
	"Invert": () => mostraImagemInvertida(contextoRenderingDir),
	"Grayscale":  () => mostraImagemGrayScale(contextoRenderingDir),
	"+ Brightness":  () => mostraImagemBrilho(contextoRenderingDir, 100),
	"- Brightness":  () => mostraImagemBrilho(contextoRenderingDir, -100),
	"RGB Blur":  () => mostraImagemBlurRgb(contextoRenderingDir),
	"Gauss Blur 0": () => mostraImagemGauss(contextoRenderingDir),
	"Gauss Blur 1": () => mostraImagemGauss(contextoRenderingDir),
	"Gauss Blur 2": () => mostraImagemGauss(contextoRenderingDir),
}


// ################################################
// ##################### HTML #####################
// ################################################

const select = document.getElementById("imagens");
for (let index = 0; index < imagens.length; ++index) {
	const imagem = imagens[index];
	const el = document.createElement("option");
	el.value = index;
	el.textContent = imagem.slice(0, imagem.length - 4);
	select.appendChild(el)
}

select.addEventListener("change", () => atualizaImagem(select.value))

/** @type {HTMLCanvasElement} */
const canvasEsq = document.getElementById("canvas-esq");
const canvasDir = document.getElementById("canvas-dir");
/** @type {CanvasRenderingContext2D} */
const contextoRenderingEsq = canvasEsq.getContext("2d");
const contextoRenderingDir = canvasDir.getContext("2d");

const containerDosToggles = document.getElementById("container");


const inputesDoTogglePorChave = { }

const criaToggle = ({ nomeDoToggle, eventoDoToggle }) => {
	const container = document.createElement("div");
	container.classList.add("esse-lixo");

	/** @type {HTMLParagraphElement} */
	const paragrafo = document.createElement("p");
	paragrafo.textContent = `${nomeDoToggle}`;
	paragrafo.classList.add("texto");

	const label  = document.createElement("label");
	label.classList.add("switch");
	
	const input = document.createElement("input");
	input.type = "checkbox";
	input.classList.add("inputao")
	input.addEventListener("change", () => eventoDoToggle(input.checked))

	inputesDoTogglePorChave[nomeDoToggle] = input;

	const span = document.createElement("span");
	span.classList.add("slider");
	span.classList.add("round");

	label.appendChild(input);
	label.appendChild(span);

	container.appendChild(label);
	container.appendChild(paragrafo);

	return container;
}

const ativaOToggle = chaveDoToggle => {
	const toggle = inputesDoTogglePorChave[chaveDoToggle];
	toggle.checked = true;
	const e = new Event("change");
	toggle.dispatchEvent(e);
}


/** @type {String[]} */
const filtrosParaAplicar = []
const limpaFiltrosAplicados = () => filtrosParaAplicar.length = 0;

/** @param {String} chave */
const removeDosFiltrosParaAplicar = chave => {
	filtrosParaAplicar.splice(filtrosParaAplicar.indexOf(chave), 1);
}

/** @param {String} chave */
const adicionaAosFiltrosParaAplicar = chave => {
	filtrosParaAplicar.push(chave);
}

const aplicaOsFiltrosParaAplicar = () => {
	mostraOriginal(contextoRenderingDir);

	for (const chaveFiltro of filtrosParaAplicar) {
		const aplicaFiltro = filtrosPorChave[chaveFiltro];
		aplicaFiltro(contextoRenderingDir);
	}
}

const togglar = (chave, seraQueOUsuarioTogglou) => {
	if (seraQueOUsuarioTogglou) adicionaAosFiltrosParaAplicar(chave);
	else removeDosFiltrosParaAplicar(chave);
	aplicaOsFiltrosParaAplicar();
}

const criaOsToggles = () => {
	// delete os toggle antigo quando carregar outra imagem
	containerDosToggles.textContent = "";
	for (const chave in filtrosPorChave) {
		const eventoDoToggle = seraQueOUsuarioTogglou => togglar(chave, seraQueOUsuarioTogglou);
		
		const toggle = criaToggle({ nomeDoToggle: chave, eventoDoToggle });
		containerDosToggles.appendChild(toggle);
	}
}


// ################################################
// #################### UTILS #####################
// ################################################

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraOriginal = (contextoDeRender) => {
	contextoDeRender.drawImage(imgOriginal, 0, 0);
};

const coords2Dto1D = (x, y) => y * canvasDir.width * 4 + x;

/** @param {ImageData} imageData */
const clonaImageData = (imageData) => {
	const data = new Uint8ClampedArray(imageData.data);
	return new ImageData(data, imageData.width, imageData.height)
}


// ################################################
// ################### FILTROS ####################
// ################################################

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraImagemInvertida = (contextoDeRender) => {
	const imageData = contextoDeRender.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		data[i]     = 255 - data[i];
		data[i + 1] = 255 - data[i + 1];
		data[i + 2] = 255 - data[i + 2];
		// data[i + 3] = 255;
	}
	contextoDeRender.putImageData(imageData, 0, 0);
}

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraImagemGrayScale = (contextoDeRender) => {
	const imageData = contextoDeRender.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		const misturaRgb = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
		data[i]     = misturaRgb;
		data[i + 1] = misturaRgb;
		data[i + 2] = misturaRgb;
	}

	contextoDeRender.putImageData(imageData, 0, 0);
}

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraImagemBrilho = (contextoDeRender, qtdBrilho) => {
	const imageData = contextoDeRender.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		data[i]     = data[i]     + qtdBrilho;
		data[i + 1] = data[i + 1] + qtdBrilho;
		data[i + 2] = data[i + 2] + qtdBrilho;
		// data[i + 3] = 255;
	}

	contextoDeRender.putImageData(imageData, 0, 0);
}


const glitchLeftPx = (x, y, data, dataClone, px) => {
	const coord = coords2Dto1D(x, y);
	const left      = coords2Dto1D(x - 4*px, y + px)
	dataClone[coord] = data[left];
}

const glitchRightPx = (x, y, data, dataClone, px) => {
	const coord = coords2Dto1D(x, y);
	const right      = coords2Dto1D(x + 4*px, y - px)
	dataClone[coord] = data[right];
}

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraImagemBlurRgb = (contextoDeRender) => {
	const imageData = contextoDeRender.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;
	const imageDataClone = clonaImageData(imageData);
	const dataClone = imageDataClone.data;

	const lineWidth = canvasDir.width * 4;
	const lineWidthMenos1PX = lineWidth - 4;

	for (let y = 1; y < canvasDir.height-1; ++y) {
		for (let x = 4; x < lineWidthMenos1PX; x += 4) {
			// vermelho
			glitchRightPx(x, y, data, dataClone, 2);
			// azul
			// glitchLeftPx(x+2, y, data, dataClone, 2);
		}
	}

	contextoDeRender.putImageData(imageDataClone, 0, 0);
}


const aplicaGauss = (x, y, data, dataClone) => {
	const xy        = coords2Dto1D(x, y);
	const right     = coords2Dto1D(x+4, y);
	const left      = coords2Dto1D(x-4, y);
	const up        = coords2Dto1D(x, y+1);
	const down      = coords2Dto1D(x, y-1);
	const upRight   = coords2Dto1D(x+4, y+1);
	const upLeft    = coords2Dto1D(x-4, y+1);
	const downLeft  = coords2Dto1D(x-4, y-1);
	const downRight = coords2Dto1D(x+4, y-1);
	
	dataClone[xy] = (
		1/4 * data[xy] +
		1/8 * data[right] +
		1/8 * data[up] +
		1/8 * data[left] +
		1/8 * data[down] +
		1/16 * data[upRight] +
		1/16 * data[upLeft] +
		1/16 * data[downLeft] +
		1/16 * data[downRight]
	);
}

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraImagemGauss = (contextoDeRender) => {
	const imageData = contextoDeRender.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;
	const imageDataClone = clonaImageData(imageData);
	const dataClone = imageDataClone.data;

	const lineWidth = canvasDir.width * 4;
	const lineWidthMenos1PX = lineWidth - 4;

	for (let y = 1; y < canvasDir.height-1; ++y) {
		for (let x = 4; x < lineWidthMenos1PX; x += 4) {
			aplicaGauss(x, y, data, dataClone)
			aplicaGauss(x+1, y, data, dataClone)
			aplicaGauss(x+2, y, data, dataClone)
		}
	}

	contextoDeRender.putImageData(imageDataClone, 0, 0);
}


// ################################################
// ################# ENTRY POINT ##################
// ################################################

imgOriginal.onload = () => {
	canvasEsq.width  = canvasDir.width  = imgOriginal.width;
	canvasEsq.height = canvasDir.height = imgOriginal.height;
	document.getElementById("texto-top").textContent = `w: ${imgOriginal.width}, h: ${imgOriginal.height}`;
	
	mostraOriginal(contextoRenderingEsq);
	mostraOriginal(contextoRenderingDir);

	limpaFiltrosAplicados();
	criaOsToggles();
};

window.onload = () => {
	ativaOToggle(Object.keys(filtrosPorChave)[0])
}