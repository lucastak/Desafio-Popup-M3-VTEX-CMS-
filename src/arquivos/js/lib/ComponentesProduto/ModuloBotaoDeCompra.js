import Modulo from "./Modulo";

import {
	CHANGE_SKU,
	CHANGE_QTD,
	ADD_SKU_TO_CART_FAIL,
	ADD_SKU_TO_CART_SUCESS,
	ADD_TO_CART,
	ADD_SKU,
	REMOVE_SKU,
} from "./EventType";

/**
 * Modulo de compra
 * permite adicopnar produtos ao carinho
 * fornece o formulario de avise-me para produtos indisponiveis
 * exibe popup de "porduto adicionado ao carrinho"
 *
 * usa api vtex para adicionar no carrinho
 * @link https://github.com/vtex/vtex.js/tree/master/docs/checkout#addtocartitems-expectedorderformsections-saleschannel
 */

export default class ModuloBotaoDeCompra extends Modulo {
	constructor(elemento = ".btnBuy", componentStore) {
		super(elemento, componentStore);

		this.produtoEscolhido = {
			sku: null,
			quantidade: 1,
		};
		this._opcoes = {
			botaoCompra: "Comprar",
			botaoSkuIndisponivel: "Produto indisponível",
			msgVariacaoErro: "<p>Escolha uma variação.</p>",
			msgByEvent: false,
			msgAddCarrinhoErro:
				"<p>Não foi possivel adicionar ao carrinho!</p>",
			msgAddCarrinhoSucesso:
				"<p>Seu produto foi adicionado ao carrinho com sucesso!</p><p>O que deseja fazer agora?</p>",
			botaoContinuarComrpando: "Continuar comprando",
			botaoFinalizarCompra: "Finalizar compra",
			icone: "",
			customBuyBtnEvent: null,
		};
	}

	/**
	 * Atualiza a quantidade de acordo com o novo sku
	 * @param  {Event} event evento que disparou atualização
	 * @param  {Object} value objeto do sku selecionado
	 * @return {Object} this
	 */
	atualizar(event, value) {
		if (event) {
			switch (event) {
				case "change-quantidade":
					this.produtoEscolhido.quantidade = value;
					break;
				case "change-sku":
					this.produtoEscolhido.sku = value;
					this.habilitar(value.available);
					break;
				default:
					console.warn("Evento desconhecido");
					break;
			}
		} else {
			console.warn("Essa funcao só deve ser chamada por eventos js");
		}
		return this;
	}

	obterCannalDeVendas() {
		var name = "VTEXSC=sc=";
		var ca = document.cookie.split(";");
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == " ") c = c.substring(1);
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return 1;
	}

	/**
	 * Configura os eventos js que serão diparados pelo html do desenhar()
	 * @return {object} this
	 */
	configurar(opcoes) {
		this.opcoes($.extend({}, this._opcoes, opcoes));
		this.opcoes.cannalDeVendas = this.obterCannalDeVendas();

		this._store.events.subscribe(CHANGE_SKU, this.atualizar.bind(this));
		this._store.events.subscribe(CHANGE_QTD, this.atualizar.bind(this));
		this._store.events.subscribe(ADD_TO_CART, this.addToCart.bind(this));
		this._store.events.subscribe(
			ADD_SKU_TO_CART_SUCESS,
			this.sucessoAjax.bind(this)
		);
		this._store.events.subscribe(
			ADD_SKU_TO_CART_FAIL,
			this.erroAjax.bind(this)
		);

		return this;
	}

	/**
	 * Cria e insere o html com as variações dos skus
	 * @return {object} this
	 */
	desenhar() {
		const html = `
			<a class="btn-compra" id="buy-btn">
				${this.opcoes().botaoCompra}
			</a>
		`;

		this.elemento().append(html);
		this.elemento().find(".btn-compra").click(this.compra.bind(this));

		return this;
	}

	compra() {
		if (this.produtoEscolhido.sku === null) {
			this._mensagemErro(this.opcoes().msgVariacaoErro);
		} else if (
			!this.produtoEscolhido.sku.available &&
			this.produtoEscolhido.quantidade < 1
		) {
			this._mensagemErro(this.opcoes().botaoSkuIndisponivel);
		} else if (this.opcoes().customBuyBtnEvent !== null) {
			this.opcoes().customBuyBtnEvent();
		} else {
			this.addToCart();
		}
	}

	addToCart() {
		return new Promise((resolve, reject) => {
			try {
				window.vtexjs.checkout
					.addToCart(
						[
							{
								id: this.produtoEscolhido.sku.sku,
								quantity: this.produtoEscolhido.quantidade,
								seller: this.produtoEscolhido.sku.sellerId,
							},
						],
						null,
						this.opcoes().cannalDeVendas
					)
					.done((orderForm) => {
						this._store.events.publish(ADD_SKU_TO_CART_SUCESS, {
							simpleProducts: this.produtoEscolhido,
							orderForm: orderForm,
						});

						resolve(orderForm);
					})
					.fail(() => {
						this._store.events.publish(ADD_SKU_TO_CART_FAIL, {
							simpleProducts: this.produtoEscolhido,
							msg: this.opcoes().msgAddCarrinhoErro,
						});
						reject(this.opcoes().msgAddCarrinhoErro);
					});
			} catch (error) {
				this._store.events.publish(ADD_SKU_TO_CART_FAIL, {
					simpleProducts: this.produtoEscolhido,
					msg: this.opcoes().msgAddCarrinhoErro,
				});
				console.warn("Erro ao adicionar sku ao carrinho de compra");
				console.log(error);
			}
		});
	}

	sucessoAjax(items) {
		dataLayer.push({ event: "m3-addToCart" });

		if (!this._opcoes.msgByEvent) {
			let _html = `<div class="modal-add-cart modal">
				<div class="modal-add-cart__overlay"></div>
				<div class="modal-add-cart__box">
					<button class="close">
						<span> fechar </span>
						<i class="sprite sprite-fechar"></i>
					</button>
					<div class="information">
						<div class="descricao">Adicionado à <strong>Sacola</strong> </div>
						<div class="list">
							<div class="item">
								<img src="${this.produtoEscolhido.sku.image}"
									alt="${this.produtoEscolhido.sku.skuname}">
								<span class="nome">${this.produtoEscolhido.sku.skuname}</span>
							</div>
						</div>
					</div>
					<div class="acoes">
						<a href="#" class="continue">Continuar</a>
						<a href="/checkout/#/cart" class="cart" target="_top">Finalizar compra</a>
					</div>
				</div>
			</div>`;

			let $popup = $(_html);

			this.elemento().find(".erro-add-cart").fadeOut("slow");
			// $popup.hide().appendTo(this.elemento()).fadeIn('slow');
			$popup.appendTo(this.elemento());
			$popup.addClass("show");
			$popup.on(
				"click",
				".modal-add-cart__overlay,.continue,.close",
				(event) => {
					event.preventDefault();
					$popup.removeClass("show");
					$popup.remove();
				}
			);
		}
	}

	/**
	 * Altera o texto do botão para produtos indisponiveis
	 * @param {boolean} habilitar
	 */
	erroAjax(e, { msg }) {
		console.log(msg);
		this._mensagemErro(msg);
		// this.opcoes().msgAddCarrinhoErro
	}

	habilitar(habilitar) {
		habilitar = typeof habilitar == "undefined" ? true : habilitar;
		this.elemento().toggleClass("desativado", !habilitar);
		var textBtn = habilitar
			? this.opcoes().icone + this.opcoes().botaoCompra
			: this.opcoes().botaoSkuIndisponivel;
		this.elemento().find(".btn-compra").html(textBtn);
	}

	_mensagemErro(mensagemDeErro) {
		if (this.elemento().find(".erro-add-cart").length < 1) {
			let _html = `<div class="erro-add-cart">
				<span class="close"></span>
				<div class="info">${mensagemDeErro}</div>
			</div>`;

			var container = $(_html).prependTo(this.elemento());
			container.on("click", ".close", (event) => {
				event.preventDefault();
				container.fadeOut("slow");
			});
		} else {
			this.elemento().find(".erro-add-cart").fadeIn("slow");
		}
		setTimeout(
			function () {
				this.elemento().find(".erro-add-cart").fadeOut("slow");
				setTimeout(() => {
					this.elemento().find(".erro-add-cart").remove();
				}, 400);
			}.bind(this),
			20000
		);

		this.elemento().find(".modal-add-cart").remove();
		this.elemento().find(".modal-add-cart__overlay").remove();
	}
}
