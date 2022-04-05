let hasDataLayer = true;
if (typeof dataLayer === "undefined") {
	hasDataLayer = false;
}
/**
 * Remover do Carrinho
 */
export function addToCartM3GtmEvent() {
	if (hasDataLayer) dataLayer.push({ event: "m3-addToCart" });
}

/**
 * Visualização Virtual de Produto
 */
export function productDetailM3GtmEvent() {
	if (hasDataLayer) dataLayer.push({ event: "m3-productDetail" });
}

/**
 * Remover do Carrinho
 */
export function removeFromCartM3GtmEvent() {
	if (hasDataLayer) dataLayer.push({ event: "m3-removeFromCart" });
}
