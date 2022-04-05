import Modulo from "./Modulo";
import { CHANGE_SKU, SKU_REF } from "./EventType";

export default class ModuloSkus extends Modulo {
	constructor(skuJson, elemento = ".skuSelection", componentStore) {
		super(elemento, componentStore);
		sessionStorage.removeItem("sku-selecionado");
		this._skuJson = skuJson;
	}

	/**
	 * Atualiza os valores no html que foi criado
	 * @return {object} this
	 */
	atualizar() {
		this.desenhar();
		return this;
	}

	/**
	 * Escolhe os primeiros skus de cada variação
	 * @return {object} this
	 */
	setDefauls() {
		return this;
	}

	escolherSku(sku) {
		if (sku) {
			this._store.events.publish(CHANGE_SKU, sku);
			this._store.commit("setSelectedSku", sku);
		} else {
			console.warn("Não conseguimos identificar o sku correspondente");
			// console.warn(especificacoesDoSku);
		}
	}

	escolherSkuReferencia(sku) {
		if (typeof this._skuReferencial === "undefined") {
			this._skuReferencial = sku;
			/**
			 * para capturar o evento
			 * $(document).on( 'change-sku' , function(event, novoSku){} );
			 */

			sessionStorage.setItem("sku-referencial", JSON.stringify(sku));
			this._store.events.publish(SKU_REF, sku);
		}
	}
}
