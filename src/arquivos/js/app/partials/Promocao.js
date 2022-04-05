export default class Promocao {
	constructor() {
		var urlAtual = new URL(window.location.href);
		try {
			window.vtexjs.checkout.getOrderForm().then(function (orderForm) {
				var marketingData = {
					utmCampaign: urlAtual.searchParams.get("utm_campaign"),
					utmMedium: urlAtual.searchParams.get("utm_medium"),
					utmSource: urlAtual.searchParams.get("utm_source"),
					utmiCampaign: urlAtual.searchParams.get("utmi_campaign"),
					utmiPart: urlAtual.searchParams.get("utmi_part"),
					utmipage: urlAtual.searchParams.get("utmi_page"),
				};
				// clean data
				for (var i in marketingData) {
					if (marketingData.hasOwnProperty(i)) {
						if (marketingData[i] == null) {
							delete marketingData[i];
						}
					}
				}

				if (Object.keys(marketingData).length === 0) {
					console.info("No marketingData defined");
					return;
				}

				if (orderForm.marketingData !== null) {
					console.info(
						"Replace marketingData :\n",
						orderForm.marketingData,
						"\nFor:\n",
						marketingData
					);
				}

				return window.vtexjs.checkout.sendAttachment(
					"marketingData",
					marketingData
				);
			});
		} catch (error) {
			console.info("Vtexjs não existe nesse ambiente");
		}
	}
}
