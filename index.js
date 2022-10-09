// ################################################
// #################### CONFIG ####################
// ################################################
const imgOriginal = new Image();
imgOriginal.crossOrigin = "anonymous";

const imagensDefault = [
	"venus.jpg",
	"adriano-rei-da-cerveja.jpg",
	"ednaldo.png",
	"nuvens-4k.jpg",
	"flora.png",
	"grayscale-angel.jpg",
	"tengu-of-ashina.jpg",
	"ilusao-de-deriva-periferica.jpg",
	"noise-girl.png",
	"noise-balloons.png",
	"blur-menino-ney.jpg",
	"yuv-encoding-jpeg.png",
];

let nomeDaImagem = "default.png";
const atualizaImagem = (imagemBase64, nome) => {
	imgOriginal.src = imagemBase64;
	nomeDaImagem = nome;
}

const atualizaImagemParaDefault = index => {
	const nome = imagensDefault[index];
	imgOriginal.src = `imgs/${nome}`;
	nomeDaImagem = nome;
}

atualizaImagemParaDefault(0);

const filtrosPorChave = {
	"Invert": () => mostraImagemInvertida(contextoRenderingDir),
	"RGB Glitch":  () => mostraImagemRgbGlitch(contextoRenderingDir),
	"Grayscale Rec 601":  () => mostraImagemGrayScale(contextoRenderingDir, 0.2989, 0.5870, 0.1140),
	"Grayscale Rec 709":  () => mostraImagemGrayScale(contextoRenderingDir, 0.2126, 0.7152, 0.0722),
	"+ Brightness":  () => mostraImagemBrilho(contextoRenderingDir, 100),
	"- Brightness":  () => mostraImagemBrilho(contextoRenderingDir, -100),
	"Gaussian Blur 1x": () => mostraImagemGauss(contextoRenderingDir, 1),
	"Gaussian Blur 2x": () => mostraImagemGauss(contextoRenderingDir, 2),
	"Gaussian Blur 3x": () => mostraImagemGauss(contextoRenderingDir, 3),
	"Median Filter 1x": () => mostraImagemMediana(contextoRenderingDir, insertionSort, 1),
	"Median Filter 2x": () => mostraImagemMediana(contextoRenderingDir, insertionSort, 2),
	"Median Filter 3x": () => mostraImagemMediana(contextoRenderingDir, insertionSort, 3),
}


// ################################################
// ##################### HTML #####################
// ################################################

/** @type {HTMLInputElement} */
const inputSubirImagem = document.getElementById("abrir");
inputSubirImagem.onchange = eventoDeChange => {
	const reader = new FileReader();
	const nomeImagem = inputSubirImagem.files.item(0).name;
	reader.onload = eventoDeLoad => atualizaImagem(eventoDeLoad.target.result, nomeImagem);

	reader.readAsDataURL(eventoDeChange.target.files[0]);
}

/** @type {HTMLInputElement} */
const botaoSalvar = document.getElementById("salvar");
botaoSalvar.onclick = () => {
	/** @type {HTMLAnchorElement} */
	const link = document.createElement('a');
	
	link.download = nomeDaImagem;
	link.href = canvasDir.toDataURL();
	link.click();
}

/** @type {HTMLSelectElement} */
const select = document.getElementById("imagens");
for (let index = 0; index < imagensDefault.length; ++index) {
	const imagem = imagensDefault[index];
	const el = document.createElement("option");
	el.value = index;
	el.textContent = imagem.slice(0, imagem.length - 4);
	select.appendChild(el)
}

select.addEventListener("change", () => {
	inputSubirImagem.value = "";
	atualizaImagemParaDefault(select.value)
});

/** @type {HTMLCanvasElement} */
const canvasEsq = document.getElementById("canvas-esq");
/** @type {HTMLCanvasElement} */
const canvasDir = document.getElementById("canvas-dir");
/** @type {CanvasRenderingContext2D} */
const contextoRenderingEsq = canvasEsq.getContext("2d");
const contextoRenderingDir = canvasDir.getContext("2d");

/** @type {HTMLDivElement} */
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


/** @type {Array<String>} */
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

const aplicaTodosOsFiltrosParaAplicar = () => {
	mostraOriginal(contextoRenderingDir);
	// mostraOriginal(contextoRenderingEsq); // não mexemos no canvas da esquerda

	for (const chaveFiltro of filtrosParaAplicar) {
		const aplicaFiltro = filtrosPorChave[chaveFiltro];
		aplicaFiltro(contextoRenderingDir);
	}
}

const togglar = (chave, seraQueOUsuarioTogglou) => {
	if (seraQueOUsuarioTogglou) {
		adicionaAosFiltrosParaAplicar(chave);
		const aplicaFiltro = filtrosPorChave[chave];
		aplicaFiltro(contextoRenderingDir);
	}
	
	else {
		removeDosFiltrosParaAplicar(chave);
		aplicaTodosOsFiltrosParaAplicar();
	}
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

/** @param {Array} arr */
const logaArray = arr => {
	let agr = "";
	arr.forEach(el => agr += `${el} `);
	console.log(agr);
}

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
const mostraImagemGrayScale = (contextoDeRender, rcoef, gcoef, bcoef) => {
	const imageData = contextoDeRender.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		const misturaRgb = rcoef  * data[i] + gcoef * data[i + 1] + bcoef * data[i + 2];
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
const mostraImagemRgbGlitch = (contextoDeRender) => {
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
			glitchLeftPx(x+2, y, data, dataClone, 2);
		}
	}

	contextoDeRender.putImageData(imageDataClone, 0, 0);
}


const aplicaGauss = (x, y, data, dataClone) => {
	const xy = coords2Dto1D(x, y);
	
	dataClone[xy] = (
		1/4  * data[xy] +
		1/8  * data[coords2Dto1D(x+4, y)] +   // right
		1/8  * data[coords2Dto1D(x-4, y)] +   // left
		1/8  * data[coords2Dto1D(x, y+1)] +   // up
		1/8  * data[coords2Dto1D(x, y-1)] +   // down
		1/16 * data[coords2Dto1D(x+4, y+1)] + // upRight
		1/16 * data[coords2Dto1D(x-4, y+1)] + // upLeft
		1/16 * data[coords2Dto1D(x-4, y-1)] + // downLeft
		1/16 * data[coords2Dto1D(x+4, y-1)]   // downRight
	);
}

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraImagemGauss = (contextoDeRender, vezes) => {
	for (let i = 0; i < vezes; ++i) {

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
}


const aplicaMediana = (x, y, data, dataClone, algoritmoDeOrdenacao) => {
	const xy = coords2Dto1D(x, y);
	
	const matrix = [
		data[xy],
		data[coords2Dto1D(x+4, y)],   // right
		data[coords2Dto1D(x-4, y)],   // left
		data[coords2Dto1D(x, y+1)],   // up
		data[coords2Dto1D(x, y-1)],   // down
		data[coords2Dto1D(x+4, y+1)], // upRight
		data[coords2Dto1D(x-4, y+1)], // upLeft
		data[coords2Dto1D(x-4, y-1)], // downLeft
		data[coords2Dto1D(x+4, y-1)], // downRight
	]
	
	const matrizOrdenada = algoritmoDeOrdenacao(matrix);

	const median = matrizOrdenada[4]
	dataClone[xy] = median;
}

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraImagemMediana = (contextoDeRender, algoritmoDeOrdenacao, vezes) => {
	for (let i = 0; i < vezes; ++i) {
		
		const imageData = contextoDeRender.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
		const data = imageData.data;
		const imageDataClone = clonaImageData(imageData);
		const dataClone = imageDataClone.data;

		const lineWidth = canvasDir.width * 4;
		const lineWidthMenos1PX = lineWidth - 4;
		
		for (let y = 1; y < canvasDir.height-1; ++y) {
			for (let x = 4; x < lineWidthMenos1PX; x += 4) {
				aplicaMediana(x, y, data, dataClone, algoritmoDeOrdenacao)
				aplicaMediana(x+1, y, data, dataClone, algoritmoDeOrdenacao)
				aplicaMediana(x+2, y, data, dataClone, algoritmoDeOrdenacao)
			}
		}
		
		contextoDeRender.putImageData(imageDataClone, 0, 0);		
	}
}


// ################################################
// ############# ALGORITMOS ORDENAÇÃO #############
// ################################################

// quick sort
const particionaQs = (arr, iEsq, iDir) => {
	const pivot = arr[Math.floor( (iDir + iEsq) * 0.5 )];
	while (iEsq <= iDir) {
		while (arr[iEsq] < pivot) iEsq++;
		while (arr[iDir] > pivot) iDir--;
		
		if (iEsq <= iDir) {
			// swap(i, j);
			const temp = arr[iEsq];
			arr[iEsq] = arr[iDir];
			arr[iDir] = temp;
			
			iEsq++;
			iDir--;
		}
	}

	return iEsq;
}

const quickSort = (arr, iEsq, iDir) => {
	const index = particionaQs(arr, iEsq, iDir);
	
	// mais elementos à esquerda do pivot
	if (iEsq < index - 1) {
		quickSort(arr, iEsq, index - 1);
	}
	
	// mais elementos à direita do pivot
	if (index < iDir) {
		quickSort(arr, index, iDir);
	}

	return arr;
}

// insertion sort
const insertionSort = (arr) => {
	for (let i = 1; i < arr.length; ++i) {
		const atual = arr[i];
		
		let j = i - 1; 
		while ( (j > -1) && (atual < arr[j]) ) {
				arr[j + 1] = arr[j];
				j--;
		}
		arr[j + 1] = atual;
	}
	
	return arr;
}

// counting sort
const countingArray = [];
countingArray.length = 256;
const limpaCountingArray = () => {
	for (let i = 0; i < countingArray.length; ++i)
		countingArray[i] = 0;
}

const countingSort = arr => {
	limpaCountingArray();
	const qtdElementos = arr.length
	const auxArray = [];
	auxArray.length = arr.length;
	
	// popula array de indices e inicializa aux com 0s
	for (let i = 0; i < qtdElementos; ++i) {
		auxArray[i] = 0;
		++countingArray[arr[i]];
	}
	
	// computa a "running sum"
	for (let i = 1; i < countingArray.length; ++i)
		countingArray[i] = countingArray[i-1] + countingArray[i];
	
	// põe os valores de arr na posição que runningSum[arr[i]] - 1 indica
	for (let i = 0; i < qtdElementos; ++i) {
		const valorAtual = arr[i];
		auxArray[--countingArray[valorAtual]] = valorAtual;
	}
	
	return auxArray;
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







