export default class Modulo {
	/**
	 * Modulo de criação de html
	 * preenchendo com JSON
	 * atualizado por eventos js
	 */
	constructor(elemento, store) {
		this.elemento(elemento);
		this.store(store);
	}

	/**
	 * Atualiza os valores no html que foi criado
	 * @return {object} this
	 */
	atualizar() {
		return this;
	}

	store(store) {
		this._store = store;
		return this._store;
	}

	/**
	 * Cria e insere o html com as variações dos skus
	 * @return {object} this
	 */
	desenhar() {
		return this;
	}
	/**
	 * Configura os eventos de atualizacao
	 * @return {object} this
	 */
	configurar(opcoes) {
		this.opcoes($.extend({}, this._opcoes, opcoes));
		return this;
	}
	/**
	 * Get/Set elemento onde sera inserido
	 * @param  {String} seletor seletor em formato css
	 * @return {JqueryElement}
	 */
	elemento(seletor) {
		if (seletor)
			this._elemento = typeof seletor === "string" ? $(seletor) : seletor;
		return this._elemento;
	}
	/**
	 * Get/Set opcoes do modulo
	 * @param  {JSON} opcoes seletor em formato cssopções do modulo
	 * @return {JSON}
	 */
	opcoes(opcoes) {
		if (opcoes) this._opcoes = opcoes;
		return this._opcoes;
	}
	/**
	 * Função para ativar/exibir um modulo
	 * @param {boolean} habilitar
	 */
	habilitar(habilitar) {
		habilitar = typeof habilitar == "undefined" ? true : habilitar;
		if (habilitar == true) {
			this.elemento().removeClass("desativado");
		} else {
			this.elemento().addClass("desativado");
		}
	}
}
