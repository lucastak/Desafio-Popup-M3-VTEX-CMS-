import ModuloSkus from "../ModuloSkus";
import { textoParaNomeCss, alterarTamanhoImagemSrcVtex } from "../util";

/**
 * modulo de seleção dos skus
 * Permite escolher o Sku desejado
 */
export default class ModuloSkusPorEspecificacoes extends ModuloSkus {
	constructor(skuJson, elemento, componentStore) {
		super(skuJson, elemento, componentStore);
		sessionStorage.removeItem("sku-selecionado");

		this.opcoes({
			especificacaoComImagem: "",
		});

		this.prefix = {
			cor: "",
			tamanho: "",
		};
	}

	/**
	 * Escolhe os primeiros skus de cada variação
	 * @return {object} this
	 */
	setDefauls(hasSetDefauls) {
		let bestSku = this._getBestSku();
		this.escolherSkuReferencia(bestSku);

		// if(this._skuJson.skus.length === 1){
		if (hasSetDefauls) {
			// forçar escolha do unico sku
			for (const especificacao in bestSku.dimensions) {
				if (bestSku.dimensions.hasOwnProperty(especificacao)) {
					const valorEspecificacao =
						bestSku.dimensions[especificacao];
					let $especificacao = this._producraInputNtmlParaEspecificacao(
						especificacao,
						valorEspecificacao
					);
					$especificacao.prop("checked", true);
				}
			}
			this.escolherSku(bestSku);
		}
		// }

		return this;
	}

	/* Prefixa o nome da especificação de acordo com a dimensão passada */
	prefixDimensionName(dimension) {
		var value = dimension.toLowerCase();

		if (this.prefix[value]) {
			return `${this.prefix[value]} ${value}`;
		} else {
			return `${dimension}`;
		}
	}

	/**
	 * Cria e insere o html com as variações dos skus
	 * @param  {Object} mapaEspecificacoes Mapa das especificações do produto
	 * @return {object} this
	 */
	desenhar() {
		if (
			!this._skuJson.dimensionsMap ||
			this._skuJson.dimensionsMap.length === 0
		) {
			console.warn("Erro! para de especificações não identificado.");
			return this;
		}

		for (var indice in this._skuJson.dimensions) {
			if (this._skuJson.dimensions.hasOwnProperty(indice)) {
				let nomeEspecificacao = this._skuJson.dimensions[indice];
				let values = this._skuJson.dimensionsMap[nomeEspecificacao];
				let isSingleOption = values.length < 2;

				var nameCampo = textoParaNomeCss(
					`${this.elemento().selector}_${nomeEspecificacao}_${indice}`
				);

				let _html = `
				<div class="especificacao ${textoParaNomeCss(nomeEspecificacao)} ${
					!isSingleOption ? "multi-option" : "single-option"
				}"
					data-especificacao="${textoParaNomeCss(nomeEspecificacao)}">

					<div class="titulo" >${this.prefixDimensionName(nomeEspecificacao)}:</div>
					<ul class="skus">${values
						.map((item, i) => {
							let disponivilidade = "";
							var idText = textoParaNomeCss(
								`${
									this.elemento().selector
								}_${nomeEspecificacao}_${item}_${indice}`
							);

							// adiciona informação de disponibilidade
							try {
								let sku = this._getSkuPorEspecificacoes({
									[nomeEspecificacao]: item,
								});
								if (typeof sku !== "undefined")
									disponivilidade = sku.available
										? "disponivel"
										: "indisponivel";
							} catch (error) {
								console.info(error);
							}

							return `<li class="sku">
								<input data-especificacao="${item}"
									data-especificacao-title="${nomeEspecificacao}"
									id="${idText}"  type="radio" value="${item}"
									name="${nameCampo}"
									${isSingleOption ? "checked" : ""}>
								${(() => {
									if (
										nomeEspecificacao ===
										this._opcoes.especificacaoComImagem
									) {
										let src = _obtemImagemParaEspecificacao(
											nomeEspecificacao,
											item
										);

										return `<label for="${idText}" class="${disponivilidade} with-image">
											<img src="${alterarTamanhoImagemSrcVtex(
												src,
												72,
												100
											)}" title="${nomeEspecificacao}: ${item}" />
										</label>`;
									} else {
										return `<label for="${idText}" class="${disponivilidade}">${item}</label>`;
									}
								})()}
							</li>`;
						})
						.join("")}</ul>
				</div>`;

				$(_html).appendTo(this.elemento());
			}
		}
		this._events();

		return this;
	}

	_events() {
		this.elemento()
			.find(".especificacao input")
			.on("change", () => {
				var especificacoesDoSku = {},
					sku;
				var nomeEspecificacao = "";
				this.elemento()
					.find(".especificacao input:checked")
					.each(function () {
						nomeEspecificacao = this.getAttribute(
							"data-especificacao-title"
						);
						especificacoesDoSku[
							nomeEspecificacao
						] = this.getAttribute("data-especificacao");
					});
				sku = this._getSkuPorEspecificacoes(especificacoesDoSku);
				this.escolherSku(sku);
			});
	}

	_getSkuPorEspecificacoes(especificacoes) {
		return this._skuJson.skus.find((sku) => {
			return this._isEquivalent(sku.dimensions, especificacoes);
		});
	}

	/**
	 * @link http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
	 */
	_isEquivalent(a, b) {
		var aProps = Object.getOwnPropertyNames(a);
		var bProps = Object.getOwnPropertyNames(b);
		if (aProps.length != bProps.length) {
			return false;
		}
		for (var i = 0; i < aProps.length; i++) {
			var propName = aProps[i];
			if (a[propName] !== b[propName]) {
				return false;
			}
		}
		return true;
	}

	_getBestSku() {
		var bestSku;
		for (const i in this._skuJson.skus) {
			if (this._skuJson.skus.hasOwnProperty(i)) {
				const sku = this._skuJson.skus[i];
				if (sku.available) {
					bestSku = sku;
					break;
				}
			}
		}
		if (typeof bestSku === "undefined") {
			bestSku = this._skuJson.skus[0];
		}
		return bestSku;
	}

	_producraInputNtmlParaEspecificacao(especificacao, valor) {
		especificacao = textoParaNomeCss(especificacao);
		let $lista = this.elemento().find(
			'.especificacao[data-especificacao="' + especificacao + '"]'
		);
		return $lista.find('li input[data-especificacao="' + valor + '"]');
	}

	_obtemImagemParaEspecificacao(especificacao, valor) {
		for (const i in this._skuJson.skus) {
			if (this._skuJson.skus.hasOwnProperty(i)) {
				const sku = this._skuJson.skus[i];

				for (const tituloEspecificacao in sku.dimensions) {
					if (sku.dimensions.hasOwnProperty(tituloEspecificacao)) {
						if (tituloEspecificacao === especificacao) {
							if (sku.dimensions[tituloEspecificacao] === valor) {
								var urlSku = "/produto/sku/" + sku.sku;
								let skuData;
								var jqXHR = $.ajax({
									url: urlSku,
									type: "GET",
									success: function (value) {
										const images = value[0].Images;
										const thumbsCor =
											images[images.length - 1];
										skuData =
											thumbsCor[thumbsCor.length - 1]
												.Path;
									},
									async: false,
								});

								if (skuData) {
									return skuData;
								}
								return sku.image;
							}
						}
					}
				}
			}
		}
		return "";
	}
}
