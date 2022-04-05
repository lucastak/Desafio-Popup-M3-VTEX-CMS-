export default class CrossSelling {
	constructor(idProduct, elemento = ".product-info .similares") {
		this._elemento = elemento;
		this._idProduct = idProduct;

		this._url = {
			similars: "/api/catalog_system/pub/products/crossselling/similars/",
			suggestions:
				"/api/catalog_system/pub/products/crossselling/suggestions/",
			accessories:
				"/api/catalog_system/pub/products/crossselling/accessories/",
		};
	}

	similars(title = "") {
		try {
			this._loadProduct("similars").done(
				(products, textStatus, jqXHR) => {
					this._desenhar(products, "similars", title);
				}
			);
		} catch (error) {
			console.warn(error);
		}
	}
	suggestions(title = "") {
		try {
			this._loadProduct("suggestions").done(
				(products, textStatus, jqXHR) => {
					this._desenhar(products, "suggestions", title);
				}
			);
		} catch (error) {
			console.warn(error);
		}
	}
	accessories(title = "") {
		try {
			this._loadProduct("accessories").done(
				(products, textStatus, jqXHR) => {
					this._desenhar(products, "accessories", title);
				}
			);
		} catch (error) {
			console.warn(error);
		}
	}

	_loadProduct(type = "similars") {
		if (this._url.hasOwnProperty(type)) {
			return $.ajax({
				url: `${this._url[type]}/${this._idProduct}`,
				type: "GET",
			});
		}
		throw "Type erro on load cors selling";
	}

	_desenhar(products, type, title = "") {
		if (products.length > 0) {
			products = this._cleanProducts(products);

			let _html = `<div class="cross-selling ${type.toLowerCase()}">
				<div class="titulo">${title}</div>
				<ul class="lista">
					${products
						.map((item, i) => {
							let imgTag =
								products[i].items[0].images[0].imageTag;
							imgTag = imgTag
								.replace(/#width#/gi, "90")
								.replace(/#height#/gi, "90")
								.replace("~", "");

							return `<li class="item ${
								item.productId == this._idProduct
									? "selected"
									: ""
							}">
							<a href="${item.link}" title="${item.productName}">${imgTag}</a>
						</li>`;
						})
						.join("")}
				</ul>
			</div>`;
			// insere no DOM
			let $products = $(_html);
			$(this._elemento).append($products);

			// Ativa slide
			$products.find("ul").slick({
				dots: false,
				autoplay: true,
				autoplaySpeed: 3000,
				arrows: false,
				infinite: true,
				slidesToShow: 4,
				slidesToScroll: 4,
				speed: 500,
				variableWidth: true,
			});
		}
	}

	_cleanProducts(products) {
		let cleanProducts = [];
		let usedIds = [];

		// cria lista sem repetiçaõ de produtos
		for (let i = 0; i < products.length; i++) {
			const item = products[i];
			if (usedIds.indexOf(item.productId) < 0) {
				cleanProducts.push({ ...item });
				usedIds.push(item.productId);
			}
		}
		try {
			return cleanProducts.sort((a, b) => a.productName <= b.productName);
		} catch (error) {
			return cleanProducts;
		}
	}
}
