import Modulo from "../Modulo";
import { getPrice } from "../util";

export default class ModuloPrecoDe extends Modulo {
	constructor(elemento, componentStore) {
		super(elemento, componentStore);
		this.opcoes({
			ativo: true,
		});
	}

	desenhar() {
		let _html = `<div class="valor-de">
			<strong class="value"></strong>
		</div>`;
		var valorDe = $(_html);

		this.elemento(valorDe);
		return valorDe;
	}

	atualizar(novoSku) {
		var precoDe = novoSku.listPrice / 100,
			precoPor = novoSku.bestPrice / 100;

		var valorDe = this.elemento();
		if (this.opcoes().ativo) {
			if (precoDe > precoPor) {
				valorDe.find(".value").text("R$ " + getPrice(precoDe));
				valorDe.css("display", "block");
			} else {
				valorDe.css("display", "none");
			}
		} else {
			valorDe.css("display", "none");
		}
	}
}
