import Components from "Lib/ComponentesProduto/index";

export default class ProductModules {
	constructor(opts) {
		this.opts = {
			priceSelector: opts?.priceSelector || ".product__price",
			qtdSelector: opts?.qtdSelector || ".product__qtd",
			buyBtnSelector: opts?.buyBtnSelector || ".product__buy-btn",
			skuSelector: opts?.skuSelector || ".product__skus",
			alertMeSelector: opts?.alertMeSelector || ".product__alert-me",
			skuJson: opts?.skuJson || window.skuJson,
			store: opts?.store || new Components.ComponentStore(),
		};
		this.store = this.opts.store;
		this.mapearSkus(this.opts.skuJson);
		this.preco(this.opts.priceSelector);
		this.quantidade(this.opts.qtdSelector);
		this.botaoDeCompra(this.opts.buyBtnSelector);
		this.selecaoSkus(this.opts.skuSelector, this.skuJson);
		this.aviseme(this.opts.alertMeSelector);
	}

	mapearSkus(skuJson) {
		this.skuJson = mapearSkus(skuJson);
	}

	preco(elemento) {
		var moduloPreco = new Components.ModuloPreco(
			elemento,
			this.store
		).configurar({
			precoDe: {
				ativo: false,
			},
			precoPor: {
				ativo: true,
			},
			parcelado: {
				ativo: true,
				auto: false,
			},
			boleto: {
				ativo: false,
			},
		});
		moduloPreco.desenhar();
	}

	selecaoSkus(elemento, skuJsonAdultered) {
		var ModuloSkus = new Components.ModuloSkusPorEspecificacoes(
			skuJsonAdultered,
			elemento,
			this.store
		);
		// ModuloSkus.elemento();
		ModuloSkus.desenhar().configurar();
		return ModuloSkus.setDefauls(false);
		// this.opcaoSkuIndisponivel();
	}

	quantidade(elemento) {
		var moduloBtnQtd = new Components.ModuloBtnQtd(elemento, this.store);
		moduloBtnQtd.configurar({
			max: 50,
		});

		var moduloQuantidade = new Components.ModuloQuantidade(
			elemento,
			this.store
		);
		moduloQuantidade.configurar({
			maxEstoque: 50,
		});
		moduloQuantidade.moduloExibicao(moduloBtnQtd);
		moduloQuantidade.desenhar();
	}

	botaoDeCompra(elemento) {
		this.moduloBotaoDeCompra = new Components.ModuloBotaoDeCompra(
			elemento,
			this.store
		);
		this.moduloBotaoDeCompra.configurar({
			botaoCompra: "Comprar",
			botaoSkuIndisponivel: "Indisponível",
			msgAddCarrinhoSucesso: "Adicionado à <strong>Sacola</strong> ",
		});

		this.moduloBotaoDeCompra.desenhar();
	}

	aviseme(elemento) {
		var opcoes = {
			titulo: `
			<p class="alert-me__title">Produto indisponível</p>
			<p class="alert-me__text">Avise-me quando chegar</p>`,
			placeholderNome: "Digite seu nome",
			placeholderEmail: "Digite seu e-mail",
			btnSubmit: "Enviar",
		};

		var moduloAviseMe = new Components.ModuloAviseMe(elemento, this.store);
		moduloAviseMe.configurar(opcoes);
		moduloAviseMe.desenhar();
	}
}

/**
 * Função para mapear skus sem especificações no skuJson
 * esse script usa o nome de cada sku como variação "cadastrada" para o funcionameto correto dos modulos de produto
 * @param {object} skuJson
 */
function mapearSkus(skuJson) {
	var skuJsonAdultered = skuJson;
	if (skuJson.dimensions.length == 0) {
		let variationName = "variacao";
		let nameSkus = [];

		for (const i in skuJsonAdultered.skus) {
			if (skuJsonAdultered.skus.hasOwnProperty(i)) {
				const sku = skuJsonAdultered.skus[i];

				nameSkus.push(sku.skuname);
				sku.dimensions[variationName] = sku.skuname;
			}
		}

		skuJsonAdultered.dimensions.push(variationName);
		skuJsonAdultered.dimensionsInputType[variationName] = "Combo";
		skuJsonAdultered.dimensionsMap[variationName] = nameSkus;

		skuJsonAdultered._scriptMapVariations = true;
	}
	return skuJsonAdultered;
}
