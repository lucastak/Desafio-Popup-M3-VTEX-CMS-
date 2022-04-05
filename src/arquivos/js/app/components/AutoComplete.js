export default class AutoComplete {
	constructor() {
		this.fixAutoComplete();
	}
	fixAutoComplete() {
		$(".fulltext-search-box").on("autocompleteopen", () => {
			$(".ui-autocomplete.ui-menu").addClass("autocompleteopen");
		});
		$(".selector").on("autocompleteclose", () => {
			$(".ui-autocomplete.ui-menu").removeClass("autocompleteopen");
		});
	}
}
