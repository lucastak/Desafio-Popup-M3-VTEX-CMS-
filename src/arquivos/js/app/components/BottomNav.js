import { isSmallerThen768 } from "Helpers/MediasMatch";

export default class BottomNav {
	constructor() {
		if (isSmallerThen768) {
			this.selectors();
			this.events();
		}
	}

	selectors() {
		this.mobileOptions = $(".mobile-bottom-options");
		this.window = $(window);
	}

	events() {
		this.window.scroll(this.handleScroll.bind(this));

		$(".mobile-bottom-options .show-search button").on("click", () => {
			this.moveToTop();
			this.focusOnSearch();
		});
	}

	handleScroll() {
		const offset = 200;
		if (this.window.scrollTop() > offset) {
			this.mobileOptions.addClass("active");
		} else {
			this.mobileOptions.removeClass("active");
		}
	}

	moveToTop() {
		$("html, body").animate(
			{
				scrollTop: 0,
			},
			500
		);
	}

	focusOnSearch() {
		$(".busca-mobile .fulltext-search-box").focus();
	}
}
