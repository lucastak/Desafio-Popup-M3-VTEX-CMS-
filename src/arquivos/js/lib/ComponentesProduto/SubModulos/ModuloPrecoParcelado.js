import Modulo from "../Modulo";
import { getPrice } from "../util";

export default class ModuloPrecoParcelado extends Modulo {
	constructor(elemento, componentStore) {
		super(elemento, componentStore);

		this.opcoes({
			auto: false,
			ativo: false,
			parcelas: 5,
		});
		this.numeroParcelas(this.opcoes().parcelas);
	}

	desenhar() {
		let _html = `<div class="valor-dividido" >
			<span>ou <strong class="numero-de-parcelas"></strong> de </span>
			<strong class="value"></strong>
			<span> sem juros</span>
		</div>`;
		var valorParcelado = $(_html);

		this.elemento(valorParcelado);
		return valorParcelado;
	}

	atualizar(novoSku) {
		if (this.opcoes().auto) {
			this.numeroParcelas(parseInt(novoSku.installments));
		}
		var precoPrincipal = novoSku.bestPrice / 100;
		var precoDivido = precoPrincipal / this.numeroParcelas();
		var valorDividido = this.elemento();
		if (this.opcoes().ativo && this.numeroParcelas() > 1) {
			valorDividido
				.find(".numero-de-parcelas")
				.text(this.numeroParcelas() + "x");
			valorDividido.find(".value").text("R$ " + getPrice(precoDivido));
			valorDividido.css("display", "block");
		} else {
			valorDividido.css("display", "none");
		}
	}

	numeroParcelas(numeroParcelas) {
		if (numeroParcelas) {
			this.opcoes().parcelas = numeroParcelas;
		}
		return this.opcoes().parcelas;
	}
}
