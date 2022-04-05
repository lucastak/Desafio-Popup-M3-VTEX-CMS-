import Modulo from "./Modulo";
import { SKU_REF, CHANGE_SKU } from "./EventType";
/**
 * Modulo de quantidade
 * Permite escolher a quantidade de um sku
 */
export default class ModuloQuantidade extends Modulo {
	constructor(elemento = ".avise-me-container:first-child", store) {
		super(elemento, store);
		this.opcoes({
			maxEstoque: 50,
		});
	}

	/**
	 * Configura os eventos js que serão diparados pelo html do desenhar()
	 * @return {object} this
	 */
	configurar(opcoes) {
		super.configurar(opcoes);

		this._store.events.subscribe(SKU_REF, (event, sku) => {
			this.atualizar(sku);
		});
		this._store.events.subscribe(CHANGE_SKU, (event, sku) => {
			this.atualizar(sku);
		});
		return this;
	}

	/**
	 * Atualiza a quantidade de acordo com o novo sku
	 * @param  {Event} event evento que disparou atualização
	 * @param  {Object} novoSku objeto do sku selecionado
	 * @return {Object} this
	 */
	atualizar(novoSku) {
		if (novoSku?.available === true) {
			var estoque,
				skuId = novoSku.sku;
			try {
				estoque = window.dataLayer[0].skuStocks[skuId];
			} catch (e) {
				console.warn(
					"Erro ao buscar estoque no dataLayer, usado o availablequantity"
				);
				estoque = novoSku.availablequantity;
			}
			estoque =
				estoque > this.opcoes().maxEstoque
					? this.opcoes().maxEstoque
					: estoque;

			this.moduloExibicao().atualizar(estoque);
			this.elemento().removeClass("desativado");
		} else {
			this.moduloExibicao().atualizar(0);
			this.elemento().addClass("desativado");
		}
		return this;
	}

	/**
	 * Cria e insere o html com as variações dos skus
	 * @return {object} this
	 */
	desenhar() {
		if (this.moduloExibicao()) {
			this.moduloExibicao().elemento(this.elemento());
			this.moduloExibicao().desenhar();
		} else {
			console.warn("Modulo de exibição não definido");
		}
		return this;
	}
	/**
	 * Get/Set moduloExibicao do modulo
	 * @param  {JSON} moduloExibicao seletor em formato cssopções do modulo
	 * @return {JSON}
	 */
	moduloExibicao(moduloExibicao) {
		if (moduloExibicao) this._moduloExibicao = moduloExibicao;
		return this._moduloExibicao;
	}
}
