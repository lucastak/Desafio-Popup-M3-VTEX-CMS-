import Modulo from "./Modulo";

import ModuloPrecoDe from "./SubModulos/ModuloPrecoDe";
import ModuloPrecoPor from "./SubModulos/ModuloPrecoPor";
import ModuloPrecoParcelado from "./SubModulos/ModuloPrecoParcelado";
import ModuloPrecoBoleto from "./SubModulos/ModuloPrecoBoleto";

import { SKU_REF, CHANGE_SKU } from "./EventType";
/**
 * modulo preco
 * Mantem o preço de exibição atualizado
 */
export default class ModuloPreco extends Modulo {
	constructor(elemento = ".preco-produto", store) {
		super(elemento, store);
		this.opcoes({
			precoDe: {
				ativo: true,
			},
			precoPor: {
				ativo: true,
			},
			parcelado: {
				auto: false,
				ativo: false,
				parcelas: 6,
			},
			boleto: {
				ativo: true,
				percentual: 5,
			},
		});
		this.precos = [];
	}

	/**
	 * Configura os eventos js que serão diparados pelo html do desenhar()
	 * @return {object} this
	 */
	configurar(opcoes) {
		this.opcoes($.extend({}, this._opcoes, opcoes));

		this._store.events.subscribe(SKU_REF, (event, sku) => {
			this.atualizar(sku);
		});
		this._store.events.subscribe(CHANGE_SKU, (event, sku) => {
			this.atualizar(sku);
		});

		return this;
	}
	/**
	 * Cria e insere o html com as formas de pagamento
	 * @return {object} this
	 */
	desenhar() {
		var container = $("<div />", {
			class: "container-precos",
			css: "display:none",
		}).appendTo(this.elemento());
		if (this.opcoes().precoDe.ativo) {
			var moduloPrecoDe = new ModuloPrecoDe();
			moduloPrecoDe.configurar(this.opcoes().precoDe);
			this.elemento().append(moduloPrecoDe.desenhar());
			this.precos.push(moduloPrecoDe);
		}
		if (this.opcoes().precoPor.ativo) {
			var moduloPrecoPor = new ModuloPrecoPor();
			moduloPrecoPor.configurar(this.opcoes().precoPor);
			this.elemento().append(moduloPrecoPor.desenhar());
			this.precos.push(moduloPrecoPor);
		}
		if (this.opcoes().parcelado.ativo) {
			var moduloPrecoParcelado = new ModuloPrecoParcelado();
			moduloPrecoParcelado.configurar(this.opcoes().parcelado);
			this.elemento().append(moduloPrecoParcelado.desenhar());
			this.precos.push(moduloPrecoParcelado);
		}
		if (this.opcoes().boleto.ativo) {
			var moduloPrecoBoleto = new ModuloPrecoBoleto();
			moduloPrecoBoleto.configurar(this.opcoes().boleto);
			this.elemento().append(moduloPrecoBoleto.desenhar());
			this.precos.push(moduloPrecoBoleto);
		}
		return this;
	}
	/**
	 * Atualiza os precos de acordo com o novo sku
	 * @param  {Event} event evento que disparou atualização
	 * @param  {Object} novoSku objeto do sku selecionado
	 * @return {Object} this
	 */
	atualizar(novoSku) {
		if (!novoSku) {
			novoSku = {
				available: false,
			};
		}
		if (novoSku.available) {
			for (var tiposPreco in this.precos) {
				if (this.precos.hasOwnProperty(tiposPreco)) {
					this.precos[tiposPreco].atualizar(novoSku);
				}
			}
			this.elemento().css("display", "block");
		} else {
			this.elemento().css("display", "none");
		}
		return this;
	}
	/**
	 * Get/Set configuraçoes de tipos de precos
	 * @param  {Object} tipo um objeto contendo informações das formas de pagamento
	 * @return {Object} 	objeto de configuracao
	 */
	tiposPreco(tipo) {
		if (tipo) {
			this._tiposPreco = $.extend({}, this._tiposPreco, tipo);
		}
		return this._tiposPreco;
	}
}
