import { alterarTamanhoImagemSrcVtex } from "Helpers/vtexUtils";
import { removeFromCartM3GtmEvent } from "Helpers/gtmCustomEvents";

export default class Minicart {
	createMiniCartStructure(element) {
		const structure = `
			<div class="mini-cart-container">
				<div class="mini-cart-header">
					<i class="sprite sprite-cadeado"></i>
					<span>
						COMPRA 100% SEGURA
					</span>
					<button class="btn-close" aria-label="fechar carrinho">
						fechar
					</button>
				</div>
				<div class="mini-cart-main">
					<div class="wait-screen"></div>
					<ul class="product-list">

					</ul>
				</div>
				<div class="mini-cart-footer">
					<div class="totals-container">
						<div class="qtd-items">
							Total de <span class="value">0</span> itens
						</div>
						<div class="total">
							Subtotal: <strong>R$<span class="value">00,00</span></strong>
						</div>
					</div>
					<button class="continue-buying" aria-label="Continuar comprando">
						Continuar comprando
					</button>
					<a class="finish-order" href="/checkout/#cart">
						Finalizar compra
					</a>
				</div>
			</div>
			<div class="mini-cart-overlay"></div>
		`;

		$(element).html(structure);
	}

	listItems() {
		let orderItems = (items) => {
			$(".mini-cart-container .product-list").empty();

			for (var i = 0; i < items.length; i++) {
				var price = parseFloat(items[i].price / 100).toFixed(2);
				price = "R$ " + price.replace(".", ",");

				if (items[i].sellingPrice == 0) {
					price = "Grátis";
				}

				var orderItem = `
					<li id="${i + "-" + items[i].uniqueId}" class="product">
						<div class="product-image">
							<a href="${items[i].detailUrl}" title="${items[i].name}">
								<img src="${alterarTamanhoImagemSrcVtex(items[i].imageUrl, 80, 102)}" alt="${
					items[i].name
				}">
							</a>
						</div>
						<div class="product-options">
							<div class="product-info">
								<div class="name">${items[i].name}</div>
								<div class="product-price">${price}</div>
								<div class="product-qtd">
									<button class="remove-from-cart" aria-label="Remover um item">-</button>
									<span class="value">${items[i].quantity}</span>
									<button class="add-to-cart" aria-label="Adicionar um item">+</button>
								</div>
							</div>
							<div class="product-remove">
								<button class="remove" aria-label="Remover produto">Remover</button>
							</div>
						</div>
					</li>
				`;

				$(".mini-cart-container .product-list").append(orderItem);
			}

			this.addOneToCart();
			this.removeOneFromCart();
			this.removeFromCart();
			this.updateCartTotals();
		};

		let emptyMessage = () => {
			$(".mini-cart-container .product-list").empty();

			let emptyMesssage = `
				<li class="empty-message">
					<strong>
						Sua sacola está vazia
					</strong>
					<p>
						Para continuar comprando, navegue pelas categorias do site ou faça uma busca pelo seu produto.
					</p>
				</li>
			`;

			$(".mini-cart-container .product-list").append(emptyMesssage);

			this.updateCartTotals();
		};

		try {
			var items = window.vtexjs.checkout.orderForm.items;
			$(".mini-cart-container").removeClass("have-item");

			if (items.length > 0) {
				orderItems(items);
				$(".mini-cart-container").addClass("have-item");
			} else {
				emptyMessage();
			}
		} catch (e) {
			emptyMessage();
			console.warn("couldnt list items. " + e.message);
		}
	}
	updateCartTotals() {
		var totalQtd = 0;
		var totalPrice = 0;

		try {
			var items = window.vtexjs.checkout.orderForm.items;
			var valorSubtotalCompraEmCentavos = 0;
			var valorDescontosEmCentavos = 0;

			if (window.vtexjs.checkout.orderForm.totalizers.length > 0) {
				valorSubtotalCompraEmCentavos =
					window.vtexjs.checkout.orderForm.totalizers[0].value;

				if (window.vtexjs.checkout.orderForm.totalizers[1]) {
					if (
						window.vtexjs.checkout.orderForm.totalizers[1].id ==
						"Discounts"
					) {
						valorDescontosEmCentavos =
							window.vtexjs.checkout.orderForm.totalizers[1]
								.value;
					}
				}
			}

			totalPrice +=
				(valorSubtotalCompraEmCentavos + valorDescontosEmCentavos) /
				100;
			totalPrice = parseFloat(totalPrice).toFixed(2);

			if (isNaN(totalPrice)) {
				totalPrice = " ";
			} else {
				totalPrice = totalPrice.replace(".", ",");
			}

			$(".mini-cart-container .product-list .product").each(function () {
				var productId = $(this).attr("id");

				for (var i = 0; i < items.length; i++) {
					if (i + "-" + items[i].uniqueId == productId) {
						var qtd = parseInt(items[i].quantity);
						totalQtd += qtd;
						$(this).find(".product-qtd .value").text(qtd);
						break;
					}
				}
			});
		} catch (e) {
			console.warn("couldnt update cart info. " + e.message);
		}

		$(".mini-cart-footer .total .value").text(totalPrice);
		$(".mini-cart-footer .qtd-items .value").text(totalQtd);
	}
	updateOrderForm(productId, qtd) {
		try {
			window.vtexjs.checkout
				.getOrderForm()
				.then((orderForm) => {
					$(".mini-cart-container .wait-screen").addClass("active");
					for (var i = 0; i < orderForm.items.length; i++) {
						if (
							i + "-" + orderForm.items[i].uniqueId ==
							productId
						) {
							var itemIndex = i;
						}
					}

					var updateItem = {
						index: itemIndex,
						quantity: qtd,
					};
					return window.vtexjs.checkout.updateItems(
						[updateItem],
						null,
						false
					);
				})
				.done(function (orderForm) {
					$(".mini-cart-container .wait-screen").removeClass(
						"active"
					);
				})
				.always(() => {
					this.listItems();
				});
		} catch (e) {
			console.warn("couldnt update order form. " + e.message);
		}
	}
	addOneToCart() {
		$(".mini-cart-container .add-to-cart").click((e) => {
			var qtd = $(e.target).siblings(".value");
			var productId = $(e.target).parents(".product").attr("id");

			if ($.isNumeric(qtd.text())) {
				var valueQtd = parseInt(qtd.text());

				valueQtd += 1;
				this.updateOrderForm(productId, valueQtd);
			} else {
				this.updateOrderForm(productId, 1);
			}
		});
	}
	removeOneFromCart() {
		$(".mini-cart-container .remove-from-cart").click((e) => {
			removeFromCartM3GtmEvent();
			var qtd = $(e.target).siblings(".value");
			var productId = $(e.target).parents(".product").attr("id");

			if ($.isNumeric(qtd.text())) {
				var valueQtd = parseInt(qtd.text());
				if (valueQtd > 1) {
					valueQtd -= 1;
					this.updateOrderForm(productId, valueQtd);
				}
			} else {
				this.updateOrderForm(productId, 1);
			}
		});
	}
	removeFromCart() {
		$(".mini-cart-container .product-remove .remove").click((e) => {
			var productId = $(e.target).parents(".product").attr("id");
			this.updateOrderForm(productId, 0);
		});
	}
	configureEvents(openBtn) {
		var openMinicart = () => {
			this.listItems();
			$(".mini-cart-container").parent().toggleClass("show-mini-cart");
			$(".mini-cart-overlay").toggleClass("active");
			$(".mini-cart").parents("header").toggleClass("mini-cart-open");
		};

		var closeMinicart = function () {
			$(".mini-cart-container").parent().removeClass("show-mini-cart");
			$(".mini-cart-overlay").removeClass("active");
			$(".mini-cart").parents("header").removeClass("mini-cart-open");
		};

		$(document).on("click", openBtn, function (e) {
			event.preventDefault();
			$(openBtn).toggleClass("active");
			openMinicart();
		});

		$(document).on(
			"click",
			".mini-cart-container .btn-close, .mini-cart-container .continue-buying, .mini-cart-overlay",
			function () {
				closeMinicart();
				$(openBtn).toggleClass("active");
			}
		);
	}

	constructor(ctx, element) {
		try {
			window.window.vtexjs.checkout.getOrderForm();
		} catch (error) {
			console.warn("vtexjs not found.");
		}

		this.createMiniCartStructure(element);
		this.configureEvents(".minicart__button");
	}
}
