// ################################################
// ##################### HTML #####################
// ################################################
const imgOriginal = new Image();
imgOriginal.crossOrigin = "anonymous";
imgOriginal.src = "imgs/venus.jpg";
// imgOriginal.src = "imgs/clouds.jpg";
// imgOriginal.src = "imgs/king-adriano.jpg";
// imgOriginal.src = "imgs/ednaldo.png";

const canvasEsq = document.getElementById("canvas-esq");
const canvasDir = document.getElementById("canvas-dir");
const contextoRenderingEsq = canvasEsq.getContext("2d");
const contextoRenderingDir = canvasDir.getContext("2d");

const containerDosToggles = document.getElementById("container");

const inputesDoTogglePorChave = { }

/**
 * @param {Array} array
 * @param {String} elemento
 */
 const removeDoArray = (array, elemento) => {
	return array.splice(array.indexOf(elemento), 1);
}

const criaToggle = (nomeDoToggle, eventoDoToggle) => {
	const container = document.createElement("div");
	container.classList.add("esse-lixo");

	/** @type {HTMLParagraphElement} */
	const texto = document.createElement("p");
	texto.textContent = `${nomeDoToggle}: `;
	texto.classList.add("texto");

	const label  = document.createElement("label");
	label.classList.add("switch");
	
	const input = document.createElement("input");
	input.type = "checkbox";
	input.classList.add("inputao")
	input.addEventListener("change", () => eventoDoToggle(input.checked));

	inputesDoTogglePorChave[nomeDoToggle] = input;

	const span = document.createElement("span");
	span.classList.add("slider");
	span.classList.add("round");

	
	label.appendChild(input);
	label.appendChild(span);

	container.appendChild(texto);
	container.appendChild(label);

	return container;
}

const ativaOToggle = chaveDoToggle => {
	const toggle = inputesDoTogglePorChave[chaveDoToggle];
	toggle.checked = true;
	console.log("achei o toggle " + toggle);
	const e = new Event("change");
	toggle.dispatchEvent(e);
}

const filtrosPorChave = {
	"Imagem Invertida": () => mostraImagemInvertida(contextoRenderingDir),
	"Escala de Cinza":  () => mostraImagemGrayScale(contextoRenderingDir),
}

const filtrosParaAplicar = []

const aplicaOsFiltrosParaAplicar = () => {
	mostraOriginal(contextoRenderingDir);

	for (const chaveFiltro of filtrosParaAplicar) {
		const aplicaFiltro = filtrosPorChave[chaveFiltro];
		aplicaFiltro(contextoRenderingDir);
	}
}

const togglar = (chave, seraQueOUsuarioTogglou) => {
	if (seraQueOUsuarioTogglou) filtrosParaAplicar.push(chave);
	else removeDoArray(filtrosParaAplicar, chave);

	aplicaOsFiltrosParaAplicar();
}


// ################################################
// ################### FILTROS ####################
// ################################################

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



// ################################################
// ################# ENTRY POINT ##################
// ################################################

imgOriginal.onload = () => {
	canvasEsq.width  = canvasDir.width  = imgOriginal.width;
	canvasEsq.height = canvasDir.height = imgOriginal.height;
	
	contextoRenderingEsq.drawImage(imgOriginal, 0, 0);
	
	mostraOriginal(contextoRenderingEsq);
	mostraOriginal(contextoRenderingDir);

	for (const chave in filtrosPorChave) {
		const eventoDoToggle = seraQueOUsuarioTogglou => togglar(chave, seraQueOUsuarioTogglou);
		
		const toggle = criaToggle(chave, eventoDoToggle);
		containerDosToggles.appendChild(toggle);
	}
	
	// for (const chaveDoInput in inputesDoTogglePorChave) {
	// 	const inpute = inputesDoTogglePorChave[chaveDoInput];
	// 	inpute.checked = true;
		
	// 	const e = new Event("change");
	// 	inpute.dispatchEvent(e);
	// }

	ativaOToggle("Imagem Invertida")

};