// ################################################
// ##################### HTML #####################
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

const select = document.getElementById("imagens");
for (let index = 0; index < imagens.length; ++index) {
	const imagem = imagens[index];
	const el = document.createElement("option");
	el.value = index;
	el.textContent = imagem.slice(0, imagem.length - 4);
	select.appendChild(el)
}

const atualizaImagem = index => {
	imgOriginal.src = `imgs/${imagens[index]}`
}

select.addEventListener("change", () => atualizaImagem(select.value))
atualizaImagem(0);


const canvasEsq = document.getElementById("canvas-esq");
const canvasDir = document.getElementById("canvas-dir");
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
	input.addEventListener("change", () => { console.log("chamando evento do toggle " + input.checked);  eventoDoToggle(input.checked); })

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
	console.log("ativando toggle " + chaveDoToggle);
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
console.log("aplicando filtros");
console.log(filtrosParaAplicar);
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
// ################### FILTROS ####################
// ################################################

const filtrosPorChave = {
	"Imagem Invertida": () => mostraImagemInvertida(contextoRenderingDir),
	"Escala de Cinza":  () => mostraImagemGrayScale(contextoRenderingDir),
	"Brilho":  () => mostraImagemBrilho(contextoRenderingDir),
}

/** @param {CanvasRenderingContext2D} contextoDeRender */
const mostraOriginal = (contextoDeRender) => {
	contextoDeRender.drawImage(imgOriginal, 0, 0);
};

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
const mostraImagemBrilho = (contextoDeRender) => {
	const imageData = contextoDeRender.getImageData(0, 0, canvasEsq.width, canvasEsq.height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		data[i]     = data[i] + 100;
		data[i + 1] = data[i + 1] + 100;
		data[i + 2] = data[i + 2] + 100;
		// data[i + 3] = 255;
	}

	contextoDeRender.putImageData(imageData, 0, 0);
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

window.onload = () => ativaOToggle(Object.keys(filtrosPorChave)[0])