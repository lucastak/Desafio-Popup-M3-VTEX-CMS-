export default class ScrollToTop {
	constructor() {
		this.selectors();
		this.events();
	}

	selectors() {
		this.offset = 200;
		this.duration = 500;
		this.scrollTopEl = $(".scroll-to-top");
		this.window = $(window);
	}

	scrollToTop(event) {
		event.preventDefault();
		$("html, body").animate(
			{
				scrollTop: 0,
			},
			this.duration
		);
		return false;
	}

	events() {
		this.scrollTopEl.click(this.scrollToTop.bind(this));
		this.window.scroll(this.handleScroll.bind(this));
	}

	handleScroll() {
		if (this.window.scrollTop() > this.offset) {
			this.scrollTopEl.fadeIn(this.duration);
		} else {
			this.scrollTopEl.fadeOut(this.duration);
		}
	}
}
