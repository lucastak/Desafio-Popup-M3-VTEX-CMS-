export default class Erro {
	constructor() {
		this.init();
	}

	buscaVazia() {
		try {
			var word = decodeURI(window.location.search);
			word = word.replace("?ft=", "");
			word = word.split("&")[0];
			$(".busca-vazia .search-term").text(`"${word}"`);
		} catch (error) {
			console.log(error);
		}
	}

	init() {
		this.buscaVazia();
	}
}
