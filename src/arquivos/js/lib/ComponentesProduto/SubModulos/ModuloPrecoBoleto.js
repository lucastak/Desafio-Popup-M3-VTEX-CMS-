import Modulo from "../Modulo";
import { getPrice } from "../util";

export default class ModuloPrecoBoleto extends Modulo {
	constructor(elemento, componentStore) {
		super(elemento, componentStore);
		this.opcoes({
			ativo: true,
		});
	}

	desenhar() {
		let _html = `<div class="preco-boleto">
			<strong class="value"></strong>
			<span> no boleto
				<span class="container-percentual">
				<span class="percentual">%</span>
				OFF</span>
			</span>
		</div>`;

		var valorBoleto = $(_html);

		this.elemento(valorBoleto);
		return valorBoleto;
	}

	atualizar(novoSku) {
		var precoPrincipal = novoSku.bestPrice / 100;
		var precoBoleto =
			precoPrincipal - (precoPrincipal * this.percentual()) / 100;
		var valorBoleto = this.elemento();
		if (this.opcoes().ativo) {
			valorBoleto.find(".percentual").text(this.percentual() + "%");
			valorBoleto.find(".value").text("R$ " + getPrice(precoBoleto));
			valorBoleto.css("display", "block");
		} else {
			valorBoleto.css("display", "none");
		}
	}
	percentual(percentual) {
		if (percentual) this._opcoes.percentual = percentual;
		return this._opcoes.percentual || 0;
	}
}
