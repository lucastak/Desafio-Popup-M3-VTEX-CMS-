export default class CrossSellingService {
	async getSimilar() {
		let productId = window.skuJson.productId;
		let url = `/api/catalog_system/pub/products/crossselling/similars/${productId}`;
		let promiseSimilar = await (await fetch(url)).json();
		return promiseSimilar;
	}
}
