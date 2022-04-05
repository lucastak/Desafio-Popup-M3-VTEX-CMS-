/** Util */

export function textoParaNomeCss(texto) {
	if (typeof texto == "undefined") {
		return "";
	}

	texto = texto
		.toLowerCase()
		.replace(/\)|\(/g, "")
		.replace(/\./g, "")
		.replace(/,/g, "")
		.replace(/ /g, "-")
		.replace(/\//g, "_")
		.replace(/[áàâã]/g, "a")
		.replace(/[ìíĩî]/g, "i")
		.replace(/[éèê]/g, "e")
		.replace(/[óòôõ]/g, "o")
		.replace(/[úùû]/g, "u")
		.replace(/[ç]/g, "c")
		.replace(/[^A-Za-z0-9_-]/g, "");
	return texto;
}

/**
 * Obtem Preco
 * caso o preco recebido seja um Float ou int,
 * 	Ex.: 10.2 ->'10,20'
 * Recebendo uma string o valor sera retornado como um float
 * 	Ex.: 'R$1.234,30' -> 1234.3
 * @param  {FloatZstring} price preço
 * @return {[type]}       [description]
 */
export function getPrice(price) {
	if (isNaN(price)) {
		price = parseFloat(
			price.replace("R$", "").replace(".", "").replace(",", ".")
		);
		return parseFloat(price);
	} else {
		price = price || 0;
		price = price.toLocaleString("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

		return price;
	}
}

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (fn, scope) {
		for (var i = 0, len = this.length; i < len; ++i) {
			fn.call(scope, this[i], i, this);
		}
	};
}

function logEvent() {
	console.log(arguments);
}
function logWarn() {
	console.warn(arguments);
}
if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, "find", {
		value: function (predicate) {
			// 1. Let O be ? ToObject(this value).
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}
			var o = Object(this);
			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;
			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
			if (typeof predicate !== "function") {
				throw new TypeError("predicate must be a function");
			}
			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
			var thisArg = arguments[1];
			// 5. Let k be 0.
			var k = 0;
			// 6. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ! ToString(k).
				// b. Let kValue be ? Get(O, Pk).
				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
				// d. If testResult is true, return kValue.
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return kValue;
				}
				// e. Increase k by 1.
				k++;
			}
			// 7. Return undefined.
			return undefined;
		},
	});
}

/**
 * Altera as dimenções especificadas na url da img
 * @param {string} src url da imagem na VTEX
 * @param {int} width
 * @param {int} height
 * @return {string} url da imagem com o tamanho alterado
 */
export function alterarTamanhoImagemSrcVtex(src, width, height) {
	if (typeof src == "undefined") {
		console.warn("Parametro 'src' não recebido.");
		return;
	}
	width = typeof width == "undefined" ? 1 : width;
	height = typeof height == "undefined" ? width : height;

	src = src.replace(
		/\/(\d+)(-(\d+-\d+)|(_\d+))\//g,
		"/$1-" + width + "-" + height + "/"
	);
	return src;
}
