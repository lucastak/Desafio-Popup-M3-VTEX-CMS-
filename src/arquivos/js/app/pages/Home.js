import slickConfig from "Config/slick";

export default class Home {
	constructor() {
		this.selectos();
		this.createSliders();
	}

	selectos() {
		this.desktopMainBanners = $(".main-banners__desktop");
		this.mobileMainBanners = $(".main-banners__mobile");
	}

	createSliders() {
		this.desktopMainBanners.slick(slickConfig.home.desktopMainBanners);
		this.mobileMainBanners.slick(slickConfig.home.mobileMainBanners);
	}
}
