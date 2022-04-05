import { isSmallerThen991 } from "Helpers/MediasMatch";

export default class FixedHeader {
	constructor() {
		if (!isSmallerThen991) {
			this.selectors();
			this.events();
		}
	}

	selectors() {
		this.pageHeader = $(".page-header");
	}

	events() {
		$(document).scroll(this.FixedHeader.bind(this));
	}

	FixedHeader() {
		const topScroll = $(document).scrollTop();
		console.log(topScroll);

		if (topScroll > 200) {
			this.pageHeader.addClass("is-fixed");
		} else {
			this.pageHeader.removeClass("is-fixed");
		}
	}
}
