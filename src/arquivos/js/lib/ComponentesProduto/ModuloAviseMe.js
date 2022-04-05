import Modulo from "./Modulo";
import { CHANGE_SKU, SKU_REF } from "./EventType";

export default class ModuloAviseMe extends Modulo {
	constructor(elemento = ".avise-me-container:first-child", componentStore) {
		super(elemento, componentStore);
		this.opcoes({
			titulo:
				'Avise-me quando o produto <span id="avise-me-produto-nome"></span> estiver disponível',
			subtitulo: "",
			fechar: "&#215;",
			placeholderNome: "Digite seu nome...",
			placeholderEmail: "Digite seu e-mail...",
			btnSubmit: "Enviar",
			msgSucesso: "Cadastrado com sucesso!",
			msgErro: "Ocorreu algum erro. Tente novamente mais tarde.",
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
		if (!novoSku) {
			novoSku = {
				available: false,
			};
		}
		if ($.isEmptyObject(novoSku)) {
			novoSku = {
				available: true,
			};
		}

		if (!novoSku.available) {
			this.elemento().find("#sku-avise-me").val(novoSku.sku);
			this.elemento().find("#avise-me-produto-nome").val(novoSku.skuname);
		}

		this.elemento().toggle(!novoSku.available);

		return this;
	}

	/**
	 * Cria e insere o html com as variações dos skus
	 * @return {object} this
	 */
	desenhar() {
		if ($(".form-avise-me").length == 0) {
			let _html = `<div class="avise-me-container">
				<fieldset class="form-avise-me">
					<a class="close" >${this.opcoes().fechar}</a>
					<h2> ${this.opcoes().titulo} </h2>
					${this.opcoes().subtitulo ? `<h3> ${this.opcoes().subtitulo} </h3>` : ""}
					<div class="avise-me-wrapper">
						<label >
							<span>${this.opcoes().placeholderNome}</span>
							<input name="notifymeClientName" type="text" id="nome-avise-me"
							placeholder="Ex.: João da silva">
						</label>
						<label >
							<span>${this.opcoes().placeholderEmail}</span>
							<input name="notifymeClientEmail" type="text" id="email-avise-me"
							placeholder="Ex.: joao.da.silva@mail.com">
						</label>
					</div>
					<input name="notifymeIdSku" type="hidden" id="sku-avise-me" class="notifyme-skuid" value="0">
					<input name="notifymeButtonOK" type="button" id="enviar-avise-me" class="btn-enviar" value="${
						this.opcoes().btnSubmit
					}">
					<p class="status"></p>
				</fieldset>
			</div>`;

			var $aviseme = $(_html).appendTo(this.elemento());

			$aviseme.on("click", ".close", () => {
				this.elemento().hide();
			});
			$aviseme.on("click", "#enviar-avise-me", this.enviar.bind(this));
		}
		this.atualizar(this._store.state.selectedSku);
		return this;
	}

	/**
	 * Funçõa que envia registra a solicitação de "avise-me"
	 */
	enviar() {
		var aviseme = this.elemento().find(".form-avise-me");
		if (!this.validar(aviseme)) {
			return false;
		}
		$.ajax({
			type: "POST",
			url: "/no-cache/AviseMe.aspx",
			data: aviseme.serialize(),
			success: function () {
				aviseme
					.find("p.status")
					.html(this.opcoes().msgSucesso)
					.addClass("msgSucesso");
				aviseme.find("input").hide();
				aviseme.find("h3").hide();
			}.bind(this),
			error: function () {
				aviseme
					.find("p.status")
					.html(this.opcoes().msgErro)
					.addClass("msgErro");
			}.bind(this),
		});
	}
	/**
	 * Função para validar os dados do formulário
	 * @param {jQueryElement} aviseme
	 */
	validar(aviseme) {
		var nome = aviseme.find("#nome-avise-me");
		var email = aviseme.find("#email-avise-me");
		var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		// if( nome.val() == '' ) {
		// 	alert( 'Por favor, digite seu nome' );
		// 	nome.focus();
		// 	return false;
		// }
		if (!filter.test(email.val())) {
			alert("Por favor, digite o email corretamente");
			email.focus();
			return false;
		}
		return true;
	}
}
