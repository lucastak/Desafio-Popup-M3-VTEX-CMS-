import Modulo from "../Modulo";
import { CHANGE_QTD } from "../EventType";

export default class ModuloSelect extends Modulo {
	constructor(elemento, componentStore) {
		super(elemento, componentStore);
		this.elemento(".qtd-selector");
		this._opcoes = {
			titulo: "Quantidade",
			opcaoDefault: "Selecione",
			opcaoIndisponivel: "Indisponivel",
		};
	}

	desenhar() {
		let _html = `<div class="qtd-selector">
			<span class="titulo">${this.opcoes().titulo}:</span>
			<span class="wrap-select">
				<select class="quantidade"></select>
			</span>
		</div>`;
		var selectQuantidade = $(_html);
		selectQuantidade.on(
			"change",
			"select.quantidade",
			this.onChange.bind(this)
		);
		selectQuantidade.appendTo(this.elemento());
		return this;
	}

	atualizar(novoEstoque) {
		var opcoes;
		if (novoEstoque > 0) {
			opcoes =
				'<option value="0" disabled >' +
				this.opcoes().opcaoDefault +
				"</option>";
			for (var i = 1; i < novoEstoque; i++) {
				opcoes += '<option value="' + i + '">' + i + "</option>";
			}
			this.elemento().removeClass("desabilitado");
		} else {
			opcoes =
				'<option value="0" disabled selected >' +
				this.opcoes().opcaoIndisponivel +
				"</option>";
			this.elemento().addClass("desabilitado");
		}
		this.elemento().find(".quantidade").html(opcoes);
	}

	onChange() {
		var quantidade = this.elemento().find(".quantidade").val();

		this._store.events.publish(CHANGE_QTD, quantidade);
	}
}
