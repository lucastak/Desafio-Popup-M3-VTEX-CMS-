import { getPrice } from "Helpers/vtexUtils";
import lojaConf from "Config/loja";
import PrateleiraService, { UPDATE_SHELF } from "./PrateleiraService";

export default class Prateleira {
	constructor(ctx) {
		this.service = ctx.getService(PrateleiraService.name);
		this.atualizar();
		this.service.events.subscribe(UPDATE_SHELF, this.atualizar.bind(this));
	}
	flagDeDesconto(elementos) {
		var $elementos = $(elementos);
		if ($elementos.length == 0) {
			$elementos = $(".produto-na-prateleira");
		}

		$elementos.not(".flagDeDesconto").each((index, el) => {
			var percentualDeDesconto = this.calcularValorDeDesconto($(el));
			if (
				percentualDeDesconto >=
				lojaConf.percentualDeDecontoMinimoParaFlag
			) {
				this.createFlagDesconto($(el), percentualDeDesconto);
			}
			$(el).addClass("flagDeDesconto");
		});
	}
	precoParcelado() {
		$(".produto-na-prateleira")
			.not(".calc")
			.each((i, el) => {
				var execucao = new window.Promise((resolve, reject) => {
					try {
						let $price = $(el).find(".price"),
							nParcelas = lojaConf.price.numeroDeParcelas;
						let valorTotal = getPrice(
							$price.find(".principal .value").text()
						);
						let valorParcelado = valorTotal / nParcelas;

						//limpa o parcelamento atual
						$(el).find(".price .parcelado").remove();
						let htmlPrecoParcelado = this.criarHtmlPrecoParcelado(
							valorParcelado,
							nParcelas
						);
						$price.append(htmlPrecoParcelado);

						resolve();
					} catch (error) {
						reject();
					}
				});
				execucao
					.then(function () {
						$(el).addClass("calc");
					})
					.catch(function () {
						$(el).find(".price .parcelado").remove();
					});
			});
	}
	precoBoleto() {
		$(".produto-na-prateleira")
			.not(".boleto")
			.each(function (i, el) {
				var execucao = new window.Promise(function (resolve, reject) {
					try {
						let $price = $(el).find(".price"),
							percentualBoleto = lojaConf.price.percentualBoleto;
						let valorTotal = getPrice(
							$price.find(".principal .value").text()
						);
						let valorBoleto =
							valorTotal - (valorTotal * percentualBoleto) / 100;

						//limpa o parcelamento atual
						$(el).find(".price .boleto").remove();
						let htmlPrecoBoleto = criarHtmlPrecoBoleto(valorBoleto);
						$price.append(htmlPrecoBoleto);

						resolve();
					} catch (error) {
						reject();
					}
				});
				execucao
					.then(function () {
						$(el).addClass("boleto");
					})
					.catch(function () {
						$(el).find(".price .boleto").remove();
					});
			});
	}
	//ex atualziar
	atualizar() {
		this.flagDeDesconto();
		//this.precoParcelado();
		//this.precoBoleto();
	}

	criarHtmlPrecoBoleto(valor) {
		var html,
			strValue = getPrice(valor);
		html = '<div class="boleto">';
		html += '<span class="value"> R$ ' + strValue + "</span>";
		html += "<span> &#224; vista no boleto</span>";
		html += "</div>";

		return html;
	}

	calcularValorDeDesconto($produto) {
		let precoAntigo = getPrice($produto.find(".antigo .value").text());
		let precoPromocao = getPrice($produto.find(".principal .value").text());
		if (!precoAntigo || !precoPromocao) return null;

		var floatDesconto = 100 - (precoPromocao / precoAntigo) * 100;
		return Math.ceil(floatDesconto);
	}

	createFlagDesconto($elemento, percentualDeDesconto) {
		var $flag = $("<p />")
			.addClass("flag produto-off")
			.text(percentualDeDesconto + "%OFF");
		$elemento.find(".flags-product .DiscountHightLight").append($flag);
	}

	criarHtmlPrecoParcelado(valor, numeroDeParcelas) {
		var html,
			strValue = getPrice(valor);

		html = '<div class="parcelado">';
		html += '<span class="desconto-parcelado"> ou ';
		html += "<strong>";
		html +=
			'<span class="numero-de-parcelas" > ' +
			numeroDeParcelas +
			"</span>X de";
		html += '<span class="value"> R$ ' + strValue + "</span>";
		html += "</strong> no cartão";
		html += "</span>";
		html += "</div>";

		return html;
	}
}
