import { isSmallerThen991 } from "Helpers/MediasMatch";

export default class Menu {
	constructor() {
		this.selectors();
		this.events();
	}

	selectors() {
		this.openMenuButton = $(".menu__button");
		this.mainMenu = $(".main-menu");
		this.closeMenuButton = $(".menu-header__close-button");
		this.departmentLink = $(".main-menu__department-link");
		this.returnButton = $(".submenu__return-button");

		if (isSmallerThen991) {
			this.departmentLink = $(".main-menu__department-link");
		}
	}

	events() {
		this.openMenuButton.click(this.openMenu.bind(this));
		this.closeMenuButton.click(this.closeMenu.bind(this));
		this.departmentLink.click(this.openSubmenu.bind(this));
		this.returnButton.click(this.closeSubmenu.bind(this));
	}

	openMenu() {
		this.mainMenu.addClass("is-open");
	}

	closeMenu() {
		this.mainMenu.removeClass("is-open");
	}

	openSubmenu(event) {
		event.preventDefault();
		const link = $(event.target);

		link.parents(".main-menu__department")
			.find(".submenu")
			.addClass("is-open");
	}

	closeSubmenu(event) {
		const button = $(event.target);

		button.parents(".submenu").removeClass("is-open");
	}
}
