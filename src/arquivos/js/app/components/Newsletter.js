import "Lib/custom-newsletter-form";

export default class Newsletter {
	constructor(ctx, { elemento, textButtom }) {
		let $elemento =
			typeof elemento !== "undefined" ? $(elemento) : $(".news-form");
		textButtom =
			typeof textButtom !== "undefined" ? textButtom : "Cadastre-se";

		$elemento.CustomNewsletter({
			shop: ctx.config.loja.accontuName,
			acronymEntity: ctx.config.loja.entityNewsletter,
			textButtom: textButtom,
		});
	}
}
