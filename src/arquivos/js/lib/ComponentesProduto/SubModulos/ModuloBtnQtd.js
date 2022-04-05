import Modulo from "../Modulo";
import { CHANGE_QTD } from "../EventType";

export default class ModuloBtnQtd extends Modulo {
	constructor(elemento, componentStore) {
		super(elemento, componentStore);
		this.elemento(".qtd-selector");
		this.store(componentStore);
		this._opcoes = {
			titulo: "Quantidade:",
			opcaoIndisponivel: "Indisponível",
			max: "1",
			min: "1",
			default: "1",
		};

		this._store.commit("setQtd", this._opcoes.default);
	}

	desenhar() {
		let _html = `<div class="quantidade">
			<span class="titulo">${this.opcoes().titulo}</span>
			<div class="campo-qtd">
				<button class="remove-from-cart" aria-label="Remover item">-</button>
				<label class="container-qtd">
					<input class="qtd-value" aria-label="Número de itens" type="number"
						data-min="${this.opcoes().min}" data-max="${this.opcoes().max}"
						value="${this._store.state.qtd}" />
				</label>
				<button class="add-to-cart" aria-label="Adicionar item">+</button>
			</div>
		</div>`;

		var $quantidade = $(_html);
		$quantidade
			.on("click", ".remove-from-cart", this.decrementBtn.bind(this))
			.on("click", ".add-to-cart", this.incrementBtn.bind(this));

		$quantidade.appendTo(this.elemento());
		this.inputChange();

		return this;
	}

	atualizar(novoEstoque) {
		this.opcoes().max = novoEstoque;

		this.elemento().find(".qtd-value").trigger("change");

		if (novoEstoque > 0) {
			this.habilitar(true);
		}

		return this;
	}

	onChange(input) {
		var $inputQuantidade = input;
		//obtem os valores de quantidade selecionada e quantidade maxima
		var min = this.opcoes().min;
		var max = this.opcoes().max;

		var qtd = parseInt($inputQuantidade.val());

		if (qtd < min || isNaN(qtd)) {
			this.notificarValor("Minimo: " + min);
			qtd = min;
		} else if (qtd > max) {
			this.notificarValor("Maximo: " + max);
			qtd = max;
		}

		//atualiza todos os skus
		$(".quantidade .qtd-value").val(qtd);

		this._store.commit("setQtd", qtd);
		this._store.events.publish(CHANGE_QTD, qtd);
		return this;
	}

	inputChange() {
		this.elemento()
			.find("input[class='qtd-value']")
			.on("focusout", (e) => {
				this.onChange.call(this, $(e.target));
			});
	}

	incrementBtn() {
		var qtd = this.elemento()
			.find(".quantidade .container-qtd")
			.find(".qtd-value");
		if ($.isNumeric(qtd.val())) {
			var valueQtd = parseInt(qtd.val());
			valueQtd += 1;
			qtd.val(valueQtd);
		} else {
			qtd.val(1);
		}
		this.onChange.call(this, qtd);
	}

	decrementBtn() {
		var qtd = this.elemento()
			.find(".quantidade .container-qtd")
			.find(".qtd-value");
		if ($.isNumeric(qtd.val())) {
			var valueQtd = parseInt(qtd.val());
			if (valueQtd > 1) {
				valueQtd -= 1;
				qtd.val(valueQtd);
			}
		} else {
			qtd.val(1);
		}

		this.onChange.call(this, qtd);
	}

	notificarValor(msg) {
		var notificacao = this.elemento().find(".notificacao");
		if (!notificacao.length) {
			notificacao = $("<div />", {
				class: "notificacao",
			}).appendTo(this.elemento().find(".container-qtd"));
		}
		notificacao.empty().text(msg).fadeIn("slow");
		setTimeout(
			function () {
				notificacao.fadeOut("slow");
			}.bind(this),
			4000
		);
		return this;
	}
}
