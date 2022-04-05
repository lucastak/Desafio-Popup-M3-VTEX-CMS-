import Modulo from "./Modulo";
import { alterarTamanhoImagemSrcVtex } from "./util";
import { CHANGE_SKU } from "./EventType";
/**
 * Modulo de quantidade
 * Permite escolher a quantidade de um sku
 */
export default class ModuloCompreJunto extends Modulo {
	constructor(elemento = ".compre-junto", store) {
		super(elemento, store);
		this.opcoes({
			titulo: "Compre junto",
		});
	}

	/**
	 * Configura os eventos js que serão diparados pelo html do desenhar()
	 * @return {object} this
	 */
	configurar(opcoes) {
		this.opcoes($.extend({}, this._opcoes, opcoes));
		this._store.events.subscribe(CHANGE_SKU, this.atualizar.bind(this));
		return this;
	}
	/**
	 * Atualiza a quantidade de acordo com o novo sku
	 * @param  {Event} event evento que disparou atualização
	 * @param  {Object} novoSku objeto do sku selecionado
	 * @return {Object} this
	 */
	atualizar(event) {
		var novoSku = JSON.parse(sessionStorage.getItem("sku-selecionado"));
		if (!novoSku) {
			novoSku = {
				available: false,
			};
		}
		if (novoSku.available) {
			var tabelaAtual = this.elemento().find(".produto-" + novoSku.sku);
			if (tabelaAtual.length != 0) {
				this.habilitar(true);
				this.elemento()
					.find(".produtos>div")
					.slideUp(
						600,
						function () {
							tabelaAtual.slideDown(600);
							this.elemento().trigger(
								"change-compre-junto",
								tabelaAtual
							);
						}.bind(this)
					);
			} else {
				this.buscarCompreJunto(novoSku.sku);
			}
		} else {
			this.habilitar(false);
		}
	}
	/**
	 * Cria e insere o html com as variações dos skus
	 * @return {object} this
	 */
	desenhar() {
		this.elemento().addClass("desativado");
		$("<h2 />", {
			class: "special-title",
			text: this.opcoes().titulo,
		}).appendTo(this.elemento());
		$("<div />", {
			class: "produtos",
		}).appendTo(this.elemento());
		return this;
	}

	/**
	 * Cria e insere o html com as variações dos skus
	 * Funçõa que busca os produtos disponiveis para
	 * comprar junto com o produto = skuid
	 * @param  skuId
	 */
	buscarCompreJunto(skuId) {
		function sucesso(htmlCJVtex, textStatus, jqXHR) {
			if (htmlCJVtex.trim().length > 1) {
				var containerCompreJunto, imagens, $produtos;
				containerCompreJunto = $("<div />", {
					class: "produto-" + skuId,
					html: htmlCJVtex,
				});
				$produtos = this.elemento().find(".produtos");
				$produtos.children().slideUp(600);
				$produtos.append(containerCompreJunto);
				this.habilitar(!0);
				imagens = $(
					".moduloCompreJunto .itemA img, .moduloCompreJunto .itemB img"
				);
				for (var i = 0; i < imagens.length; i++) {
					imagens[i].setAttribute(
						"src",
						alterarTamanhoImagemSrcVtex(imagens[i].src, 265, 403)
					);
				}
				this.elemento().trigger(
					"change-compre-junto",
					containerCompreJunto
				);
			}
		}
		function erro(jqXHR, textStatus, errorThrown) {
			console.warn(errorThrown);
			this.habilitar(false);
		}
		var jqXHR = $.get("/comprejuntosku/" + skuId);
		jqXHR.done(sucesso.bind(this)).fail(erro.bind(this));
	}
}
