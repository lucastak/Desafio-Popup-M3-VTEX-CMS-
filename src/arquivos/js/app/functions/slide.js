/*
 * 'slideResponsivo': Adiciona o passador (slider) na prateleira (shelf)
 *
 * @help http://kenwheeler.github.io/slick/
 */
export function slideResponsivo(
	elementoPaiDaListaDeProdutos,
	slidesToShowDesktop,
	slidesToShow992,
	slidesToShow768,
	slidesToShow576,
	dots,
	arrows
) {
	slidesToShowDesktop =
		typeof slidesToShowDesktop !== "undefined" ? slidesToShowDesktop : 4;
	slidesToShow992 =
		typeof slidesToShow992 !== "undefined" ? slidesToShow992 : 3;
	slidesToShow768 =
		typeof slidesToShow768 !== "undefined" ? slidesToShow768 : 2;
	slidesToShow576 =
		typeof slidesToShow576 !== "undefined" ? slidesToShow576 : 1;
	dots = typeof dots !== "undefined" ? dots : false;
	arrows = typeof arrows !== "undefined" ? arrows : true;

	$(".helperComplement").remove();

	$(elementoPaiDaListaDeProdutos).each(function (i) {
		$(this)
			.find("ul")
			.eq(0)
			.slick({
				lazyLoad: "ondemand",
				dots: dots,
				arrows: arrows,
				infinite: true,
				slidesToShow: slidesToShowDesktop,
				slidesToScroll: slidesToShowDesktop,
				speed: 500,

				responsive: [
					{
						breakpoint: 992,
						settings: {
							lazyLoad: "ondemand",
							slidesToShow: slidesToShow992,
							slidesToScroll: slidesToShow992,
							infinite: true,
						},
					},
					{
						breakpoint: 768,
						settings: {
							dots: true,
							lazyLoad: "ondemand",
							slidesToShow: slidesToShow768,
							slidesToScroll: slidesToShow768,
						},
					},
					{
						breakpoint: 576,
						settings: {
							dots: true,
							lazyLoad: "ondemand",
							slidesToShow: slidesToShow576,
							slidesToScroll: slidesToShow576,
						},
					},
				],
			});
	});
}

export function bannerHome(elementoPaiDoBanners) {
	let $elemento =
		typeof elementoPaiDoBanners !== "undefined"
			? $(elementoPaiDoBanners)
			: $(".main-gallery");

	var configDesktop = {
			dots: true,
			arrows: false,
			pauseOnHover: false,
			autoplay: true,
			autoplaySpeed: 6000,
		},
		configMobile = {
			dots: true,
			arrows: true,
			pauseOnHover: false,
			autoplay: true,
			autoplaySpeed: 6000,
		};

	$elemento.find(".desktop").slick(configDesktop);
	$elemento.find(".mobile").slick(configMobile);
}

export function naveguePorCategorias(elementoPaiDoBanners) {
	let $elemento =
		typeof elementoPaiDoBanners !== "undefined"
			? $(elementoPaiDoBanners)
			: $(".main-gallery");

	$elemento.slick({
		dots: false,
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
					infinite: false,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					infinite: false,
					autoplay: false,
					autoplaySpeed: 2000,
				},
			},
		],
	});
}

export function barraDeVantagens(barraDeVantagens) {
	let $elemento =
		typeof barraDeVantagens !== "undefined"
			? $(barraDeVantagens)
			: $(".main-gallery");

	$elemento.slick({
		autoplay: false,
		autoplaySpeed: 3000,
		dots: false,
		arrows: false,
		infinite: false,
		slidesToShow: 3,
		slidesToScroll: 3,
		speed: 500,
		variableWidth: true,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	});
}

export function produtoThumbs(thumbs) {
	let $elemento =
		typeof thumbs !== "undefined" ? $(thumbs) : $(".main-gallery");

	$elemento.slick({
		autoplay: false,
		autoplaySpeed: 3000,
		lazyLoad: "ondemand",
		dots: false,
		arrows: true,
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 1,
		speed: 500,
		vertical: true,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 768,
				settings: {
					arrows: false,
					dots: true,
					vertical: false,
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	});
}
export function navegacaoInstitucional(elemento) {
	let $elemento =
		typeof elemento !== "undefined"
			? $(elemento)
			: $(".navegacao-institucional");

	$elemento.slick({
		autoplay: false,
		autoplaySpeed: 3000,
		dots: false,
		arrows: false,
		infinite: false,
		slidesToShow: 6,
		slidesToScroll: 6,
		speed: 500,
		variableWidth: true,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
		],
	});
}
