import "jquery";
import ModuloSkus from "../ModuloSkus";
import { textoParaNomeCss, alterarTamanhoImagemSrcVtex } from "../util";
/**
 * modulo de seleção dos skus
 * Permite escolher o Sku desejado
 */

export default class ModuloSkusPorNome extends ModuloSkus {
	constructor(skuJson, elemento, store) {
		super(skuJson, elemento, store);

		sessionStorage.removeItem("sku-selecionado");

		this.opcoes({
			whithImage: true,
			title: "Escolha uma opção",
			imageWidth: 55,
			imageHeight: 65,
		});
	}

	/**
	 * Escolhe os primeiros skus de cada variação
	 * @return {object} this
	 */
	setDefauls() {
		var bestSku;

		for (const i in this._skuJson.skus) {
			if (this._skuJson.skus.hasOwnProperty(i)) {
				const sku = this._skuJson.skus[i];
				if (sku.available) {
					bestSku = sku;
					break;
				}
			}
		}

		if (typeof bestSku === "undefined") {
			bestSku = this._skuJson.skus[0];
		}
		this.escolherSkuReferencia(bestSku);

		// if(this._skuJson.skus.length === 1){
		$(`input[value="${bestSku.sku}"]`).prop("checked", true);
		this.escolherSku(bestSku);
		// }
		return this;
	}

	/**
	 * Cria e insere o html com as variações dos skus
	 * @param  {Object} mapaEspecificacoes Mapa das especificações do produto
	 * @return {object} this
	 */
	desenhar() {
		let nameCampo = textoParaNomeCss(this._skuJson.name);
		let _html = `<div class="skus-selection">
			<div class="skus-wrapper">
				<div class="titulo">${this.opcoes().title}:</div>
				<ul class="lista">${this._skuJson.skus
					.map(
						(sku, i) =>
							`<li class="sku">
						<input id="sku-id__${sku.sku}" type="radio" value="${
								sku.sku
							}" name="${nameCampo}">
						${(() => {
							if (this._opcoes.whithImage) {
								return `
								<label for="sku-id__${sku.sku}" class="${sku.available ? "" : "disable"} image">
									<img src="${alterarTamanhoImagemSrcVtex(
										sku.image,
										this._opcoes.imageWidth,
										this._opcoes.imageHeight
									)}" title="${sku.skuname}">
								</label>`;
							} else {
								return ` <label for="sku-id__${
									sku.sku
								}" class="${sku.available ? "" : "disable"} ">
										<span>${sku.skuname}</span>
									</label>`;
							}
						})()}

					</li>`
					)
					.join("")}
				</ul>
			</div>
		</div>`;

		$(_html).appendTo(this.elemento());
		return this;
	}

	/**
	 * Configura os eventos de atualizacao
	 * @return {object} this
	 */
	configurar(opceos) {
		super.configurar(opceos);
		this.elemento().on("change", ".skus-selection input", () => {
			let id = $(".skus-selection input:checked").val();

			var sku = this._getSkuPorId(id);
			console.log(id, sku);
			this.escolherSku(sku);
		});
		return this;
	}

	_getSkuPorId(id) {
		return this._skuJson.skus.find((sku) => {
			return sku.sku == id;
		});
	}
}
