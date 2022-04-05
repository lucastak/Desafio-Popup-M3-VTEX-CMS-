import Modulo from "../Modulo";
import { getPrice } from "../util";

export default class ModuloPrecoPor extends Modulo {
	constructor(elemento, componentStore) {
		super(elemento, componentStore);
		this.opcoes({
			ativo: true,
		});
	}

	desenhar() {
		let _html = `<div class="valor-por">
			<strong class="value"></strong>
		</div>`;
		var valorPor = $(_html);

		this.elemento(valorPor);
		return valorPor;
	}

	atualizar(novoSku) {
		var valorPor = this.elemento();
		if (this.opcoes().ativo) {
			var precoPor = novoSku.bestPrice / 100;
			if (precoPor) {
				valorPor.find(".value").text("R$ " + getPrice(precoPor));
				valorPor.css("display", "block");
			} else {
				valorPor.css("display", "none");
			}
		} else {
			valorPor.css("display", "none");
		}
	}
}
