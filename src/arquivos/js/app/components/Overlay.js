/* eslint-disable spaced-comment */

export default class OverLay {
	constructor(zIndex, color = "rgba(255, 255, 255, 0.5)") {
		this.color = color;
		this.build(zIndex);
	}

	registerClickEvent(clickEvent) {
		this.overlay.addEventListener("click", clickEvent);
	}

	build(zIndex) {
		const element = document.createElement("div");
		const randomId = Math.random().toString(36).substr(2, 9);

		element.setAttribute("id", `overlay_${randomId}`);

		this.overlay = element.attachShadow({ mode: "open" });

		const html = /*html*/ `
			<div class="overlay"></div>
		`;
		const styles = /*html*/ `
		<style>
			.overlay {
				position: fixed;
				top: 0;
				left: 0;
				height: 100vh;
				width: 100vw;
				z-index: ${zIndex};
				opacity: 0;
				pointer-events: none;
				transition: 0.2s;
				background: ${this.color};
			}

			.overlay.show {
				opacity: 1;
				pointer-events: all;
			}
		</style>
		`;
		this.overlay.innerHTML = html + styles;

		this.overlayDiv = document.body.appendChild(element);
	}

	show() {
		this.overlay.children[0].classList.add("show");
	}

	hide(callback = () => null) {
		this.overlay.children[0].classList.remove("show");
		callback();
	}

	destroy() {
		this.overlayDiv.remove();
	}
}
