export default {
	home: {
		desktopMainBanners: {
			dots: true,
			arrows: true,
			pauseOnHover: true,
			autoplay: true,
			autoplaySpeed: 5000,
		},

		mobileMainBanners: {
			dots: true,
			arrows: true,
			autoplay: true,
			autoplaySpeed: 5000,
		},
	},
	general: {
		tipBar: {
			arrows: false,
			dots: false,
			slidesToShow: 5,
			slidesToScroll: 5,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
			responsive: [
				{
					breakpoint: 1600,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4,
					},
				},
				{
					breakpoint: 1500,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
					},
				},
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
					},
				},
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
			],
		},
	},
	productShelf: {
		defaultShelf: {
			lazyLoad: "ondemand",
			dots: false,
			arrows: true,
			infinite: true,
			slidesToShow: 4,
			slidesToScroll: 4,
			speed: 500,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
					},
				},
				{
					breakpoint: 800,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
					},
				},
				{
					breakpoint: 576,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
			],
		},
	},
	institucional: {
		navBar: {
			arrows: false,
			dots: false,
			slidesToScroll: 4,
			slidesToScroll: 4,
			infinite: false,
			variableWidth: true,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToScroll: 3,
					},
				},
				{
					breakpoint: 576,
					settings: {
						slidesToScroll: 2,
					},
				},
			],
		},
	},
	product: {
		thumbnailImages: {
			lazyLoad: "ondemand",
			dots: false,
			arrows: false,
			infinite: false,
			slidesToShow: 5,
			slidesToScroll: 5,
			speed: 500,
			vertical: true,
			verticalSwiping: true,
			asNavFor: ".product-showcase__main__list",
			focusOnSelect: true,
			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4,
					},
				},
			],
		},
		showcaseImages: {
			arrows: true,
			dots: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			fade: true,
			infinite: false,
			asNavFor: ".product-showcase__thumbs__list",
			responsive: [
				{
					breakpoint: 768,
					settings: {
						dots: true,
					},
				},
			],
		},
		similars: {
			dots: true,
			arrows: false,
			infinite: true,
			slidesToShow: 4,
			slidesToScroll: 4,
			speed: 500,
			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
					},
				},
			],
		},
	},
};
