import { isSmallerThen768 } from "Helpers/MediasMatch";

export default class MenuContents {
	constructor() {
		if (!isSmallerThen768) {
			this.getContent();
		}
	}

	getContent() {
		let url = "/Sistema/elementosmenu";

		$.get(url, this.handleContentInsert.bind(this));
	}

	handleContentInsert(data) {
		let $conteudo = $(data);

		$("<div/>", { class: "elementos-menu" }).appendTo(
			".menu-principal .itens >li .container"
		);

		// Implementar futuramente para inserir de acordo com uma config

		// this.insertProduct($conteudo);
		this.insertBanners($conteudo);
	}

	insertProduct($conteudo) {
		let wantedContent = ".produtos-menu";
		let shelfs = $conteudo.find(wantedContent)[0];

		if (shelfs) {
			let categories = $(shelfs).find("h2");

			for (let i = 0; i < categories.length; i++) {
				let categoryName = $(categories[i]).text();

				let productMenuContainer = $(
					'.menu-principal a[title*="' + categoryName + '"]'
				)
					.parent()
					.find(".elementos-menu");

				if (productMenuContainer.length) {
					$(categories[i]).next("ul").appendTo(productMenuContainer);
					$(productMenuContainer).addClass("have-product");
				}
			}
		}
	}

	insertBanners($conteudo) {
		let wantedContent = ".banners-menu";
		let banners = $conteudo.find(wantedContent)[0];

		if (banners) {
			let imgs = $(banners).find("img");

			for (let i = 0; i < imgs.length; i++) {
				let categoryName = $(imgs[i]).attr("alt");

				let bannerMenuContainer = $(
					'.menu-principal a[title*="' + categoryName + '"]'
				)
					.parent()
					.find(".elementos-menu");

				if (bannerMenuContainer.length) {
					$(imgs[i])
						.parents(".box-banner")
						.appendTo(bannerMenuContainer);
					$(bannerMenuContainer).addClass("have-banner");
				}
			}
		}
	}
}
