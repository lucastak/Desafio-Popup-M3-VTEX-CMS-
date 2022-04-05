import { navegacaoInstitucional } from "App/functions/slide";

export default class Institucional {
	constructor() {
		var pathName = window.location.pathname;

		if (pathName) {
			$('.navegacao a[href="' + pathName + '"]').addClass("ativo");
		}
		navegacaoInstitucional();
	}
}
