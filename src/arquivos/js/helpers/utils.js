/**
 * Realiza o cálculo do preço parcelado, insere o resultado e  o número de parcelas nos devidos elementos
 *
 * @param  {float} preco Preço a ser calculado
 * @param  {int} numeroDeParcelas Número de parcelas
 * @param  {Seletor jQuery} containerPreco Seletor jQuery  do elemento onde o preço calculado será inserido
 * @param  {Seletor jQuery} containerParcelas Seletor jQuery do elemento onde o número de parcelas será inserido
 */

export function calcularEInserirPrecoParcelado(
	preco,
	numeroDeParcelas,
	$containerPreco,
	$containerParcelas
) {
	var precoParcelado = preco / numeroDeParcelas;

	if (!isNaN(precoParcelado)) {
		$containerParcelas.text(numeroDeParcelas);
		$containerPreco.text("R$ " + getPrice(precoParcelado));
	}
}

/**
 * Realiza o cálculo do preço do boleto, insere o resultado e  o percentual de desconto nos devidos elementos
 *
 * @param  {float} preco Preço a ser calculado
 * @param  {int} percentualDeDesconto Percentual de desconto
 * @param  {Seletor jQuery} containerPreco Seletor jQuery  do elemento onde o preço calculado será inserido
 * @param  {Seletor jQuery} containerParcelas Seletor jQuery do elemento onde o percentual de desconto será inserido
 */

export function calcularEInserirPrecoBoleto(
	preco,
	percentualDeDesconto,
	$containerPreco,
	$containerPercentual
) {
	var precoBoleto = preco - (preco * percentualDeDesconto) / 100;
	if (!isNaN(precoBoleto)) {
		$containerPreco.text("R$ " + util.getPrice(precoBoleto));
	}
	if (typeof $containerPercentual !== "undefined") {
		$containerPercentual.text(percentualDeDesconto + "%");
	}
}

export function removeRepeatedObjectsByKey(arr, key) {
	const seen = new Set();
	const filteredArr = arr.filter((el) => {
		const duplicate = seen.has(el[key]);
		seen.add(el[key]);
		return !duplicate;
	});

	return filteredArr;
}

export function shallowEqual(object1, object2) {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (let key of keys1) {
		if (object1[key] !== object2[key]) {
			return false;
		}
	}

	return true;
}
