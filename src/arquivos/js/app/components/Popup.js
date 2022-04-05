export default class Popup {
	constructor() {
		this.selectors();
		this.events();
		this.getExpiryTime();
	}

	selectors() {
		this.button = $(".popup__button");
		this.popup = $(".popup");
		this.overlay = $(".overlay");
		this.closeButton = $(".popup__close-button");
	}

	events() {
		this.button.click(this.validateForm.bind(this));
		this.overlay.click(this.closePopup.bind(this));
		this.closeButton.click(this.closePopup.bind(this));
	}

	testeButton() {
		console.log("Clicou no close button");
	}

	getExpiryTime() {
		console.log("entrou no getExpiryTime");
		let key = "expiration-time";
		const itemStr = localStorage.getItem(key);
		if (!itemStr) {
			this.popup.addClass("active");
			console.log("Entrou primeiro true");
			this.setOverlay();
			return;
		}
		const item = JSON.parse(itemStr);
		const now = new Date();
		if (now.getTime() > item.expiry) {
			localStorage.removeItem(key);
			this.popup.addClass("active");
			this.setOverlay();
			console.log("Entrou segundo true");
			return;
		} else {
			this.overlay.removeClass("overlay"), console.log("Entrou no false");
			return;
		}
	}

	setExpiryTime() {
		console.log("entrou no setExpiryTime");
		const key = "expiration-time";
		const oneWeek = 604800000; //7 dias em milissegundos
		const now = new Date();
		const item = {
			value: key,
			expiry: now.getTime() + oneWeek,
		};
		localStorage.setItem(key, JSON.stringify(item));
	}

	async validateForm() {
		console.log("entrou no validateForm");
		let elementName = document.querySelector(".popup__form-name");
		let elementEmail = document.querySelector(".popup__form-email");
		let re = new RegExp("@");
		var validationEmail = await this.validateEmail(elementEmail.value);

		if (elementEmail.value.length == 0) {
			this.setErros(elementEmail, "Email não pode ficar vazio!");
			return;
		} else if (!re.test(elementEmail.value)) {
			this.setErros(elementEmail, "Email precisa conter um @");
			return;
		} else if (elementEmail.value.length < 3) {
			this.setErros(
				elementEmail,
				"Email precisa ser maior que 3 caracteres"
			);
			return;
		} else if (validationEmail) {
			this.setErros(elementEmail, "Email já cadastrado, tente outro");
			return;
		} else if (elementName.value.length == 0) {
			this.setErros(elementName, "Nome não pode ficar vazio!");
			return;
		} else if (elementName.value.length < 3) {
			this.setErros(
				elementName,
				"Nome precisa ser maior que 3 caracteres"
			);
			return;
		} else {
			this.sendingData();
			this.setSuccess(elementEmail, "Cadastro realizado com sucesso!");
		}
	}

	async validateEmail(email) {
		const response = await fetch(
			`/api/dataentities/MA/search?_fields=email&_where=email=${email}`
		);
		let devolutionEmail = false;
		const responseValue = await response.json();

		if (responseValue.length > 0) {
			devolutionEmail = true;
		}
		return devolutionEmail;
	}

	sendingData() {
		console.log("entrou no SendingData");
		let inputName = document.querySelector(".popup__form-name");
		let inputEmail = document.querySelector(".popup__form-email");

		let data = {
			name: inputName.value,
			email: inputEmail.value,
		};

		console.log("Nome:", data.name);
		console.log("Email: ", data.email);

		fetch("/api/dataentities/MA/documents", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (response) {
				console.log("success", response);
			})
			.catch(function (error) {
				console.log("Error: ", error);
			});
	}

	setSuccess(element, text) {
		console.log("entrou no setSucess");
		if (document.querySelector(".successMessage") == null) {
			let success = `<span class="successMessage">${text}</span>`;
			element.insertAdjacentHTML("afterend", success);

			setTimeout(() => {
				document.querySelector(".successMessage").remove();
			}, 3000);
		}
	}

	setErros(element, text) {
		console.log("entrou no setErrors");
		if (document.querySelector(".erroMessage") == null) {
			let error = `<span class="errorMessage">${text}</span>`;
			element.insertAdjacentHTML("afterend", error);

			setTimeout(() => {
				document.querySelector(".errorMessage").remove();
			}, 3000);
		}
	}

	setOverlay() {
		this.overlay.addClass("active");
	}

	closePopup() {
		console.log("entrou no closePopup");
		this.popup.removeClass("active");
		this.overlay.removeClass("active");
		this.setExpiryTime();
	}
}
