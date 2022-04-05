/**
 * Espera um elemento exitir no dom e executa o callback
 *
 * @param {string} selector seletor do elemento que dejesa esperar pela criação
 * @param {function} callback Função a ser executada quando tal elemento existir
 */

export default function waitForEl(selector, callback) {
	const element = jQuery(selector);
	if (element.length) {
		callback(element);
	} else {
		setTimeout(function () {
			waitForEl(selector, callback);
		}, 100);
	}
}
