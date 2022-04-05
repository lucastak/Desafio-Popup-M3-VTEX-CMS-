export default class Slide {
	constructor(ctx) {
		this.slickConfig = ctx.config.slick;
		this.selector();
		this.identifySliderType();
	}

	selector() {
		this.slidersContainers = $("*[data-slider-strategy]");
	}

	identifySliderType() {
		const _this = this;
		this.slidersContainers.map((index, slider) => {
			const group = $(slider).data("slider-group");
			const strategy = $(slider).data("slider-strategy");

			const options = slickConfig[group][strategy];
			let element = slider;

			_this.startSlider(element, options);
		});
	}

	startSlider(element, options) {
		if (group == "productShelf") {
			$(".helperComplement").remove();
			element = $(slider).find("ul");
		}

		$(element).slick(options);
	}
}
