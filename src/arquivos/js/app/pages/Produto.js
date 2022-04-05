import "Lib/elevateZoom";

import loja from "Config/loja";
import Components from "Lib/ComponentesProduto";
import { alterarTamanhoImagemSrcVtex } from "Helpers/vtexUtils";
import { isSmallerThen768 } from "Helpers/MediasMatch";
import { slideResponsivo, produtoThumbs } from "App/functions/slide";
import ProductModules from "App/components/ProductModules";
import CrossSelling from "../components/CrossSelling";
import { CHANGE_SKU } from "Lib/ComponentesProduto/EventType";

export default class Produto {
	constructor() {
		this.imagensDasVariacoes();
		this.imagensCompreJunto();

		this.shortDescription();
		this.zoomImagemPrincipal();
		this.productSlides();
		this.exibirVariacaoDeCores();
		slideResponsivo(".prateleira-de-produtos", 4, 3, 1, 1, false, true);
		this.initProductComponents().catch((err) => console.error(err));
	}

	async initProductComponents() {
		const store = new Components.ComponentStore();
		this.modules = new ProductModules({
			store,
			priceSelector: ".moduloPreco",
			qtdSelector: ".moduloQuantidade",
			buyBtnSelector: ".moduloBotaoDeCompra",
			skuSelector: ".moduloSkus",
			alertMeSelector: ".moduloAviseMe",
		});

		store.events.subscribe(CHANGE_SKU, this.imagensDasVariacoes);
	}

	/*
	 * 'itempropImage': Adiciona itemprop na imagem para melhorar os meta dados da página.
	 * 'Documentação':  https://schema.org/Product
	 */
	itempropImage() {
		$(".apresentacao #image #image-main").attr("itemprop", "image");
	}

	exibirVariacaoDeCores() {
		let idProduto = window.skuJson.productId;
		let crossSelling = new CrossSelling(
			idProduto,
			".product-info .similares"
		);
		crossSelling.similars();
	}

	shortDescription() {
		$(".descricao-produto a").on("click", function (event) {
			event.preventDefault();
			$("html,body").animate(
				{
					scrollTop: $("#descricao-completa").eq(0).offset().top - 50,
				},
				500
			);
		});
	}

	zoomImagemPrincipal() {
		if (!isSmallerThen768) {
			$(".product-image .apresentacao #include").on(
				"mouseover",
				function () {
					var srcImg = $(".sku-rich-image-main").attr("src");

					$(".sku-rich-image-main").attr(
						"src",
						alterarTamanhoImagemSrcVtex(srcImg, 1000, 1000)
					);
					// ativa o zoom
					$(".sku-rich-image-main").elevateZoom({
						zoomType: "inner",
						cursor: "crosshair",
					});
				}
			);

			$("body").on("mouseleave", ".zoomContainer", function () {
				$(".sku-rich-image-main").removeData("elevateZoom");
				$(".zoomContainer").remove();
			});
		}
	}

	productSlides() {
		var $thumbs = $(".product-image .thumbs");
		produtoThumbs($thumbs);

		$(".similares ul").slick({
			dots: true,
			arrows: false,
			infinite: true,
			slidesToShow: 4,
			slidesToScroll: 4,
			speed: 500,

			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
					},
				},
			],
		});
	}

	imagensDasVariacoes(event, data) {
		if (typeof window.FireSkuSelectionChanged !== "undefined") {
			var idSku = data.sku;
			window.FireSkuSelectionChanged(idSku);
		}
	}

	imagensCompreJunto() {
		window.onload = function () {
			setTimeout(function () {
				let images = $(".compre-junto table img");

				for (let i = 0; i < images.length; i++) {
					let imageUrl = $(images[i]).attr("src");
					let newUrl = alterarTamanhoImagemSrcVtex(
						imageUrl,
						250,
						250
					);
					$(images[i]).attr("src", newUrl);
				}
			}, 1500);
		};
	}
}
