/**
 *  custom-form-newsletter.js
 *
 *  @author	Gabriel de O. Araujo
 *  @author Davi P. Guimarães
 */

"use strict";

var $form;

function CustomNewsletterFormService(opts) {
	// Model

	var _this = this;

	// Rota no servidor
	_this.route = function route(sigla) {
		sigla = sigla == undefined ? opts.acronymEntity : sigla;
		return "/api/dataentities/" + sigla;
	};

	/**
	 * Cria o objeto para ser salvo no Master Data
	 * @param  {String} clientName  Nome do cliente
	 * @param  {String} clientEmail Email do cliente
	 * @param  {object} interest    Objeto de interrece como {musica=>['Rock','Rap','Jazz']}
	 * @return {object}
	 */
	_this.create = function create(clientName, clientEmail, interest, origem) {
		return {
			m3ClientEmail: clientEmail,
			m3ClientInterest: interest,
			m3ClientName: clientName || "",
			m3Origem: origem || "",
		};
	};

	/**
	 * Submete o formulario
	 * @param {JqXhr} Objeto jQuery de requisição
	 */
	_this.add = function add(obj) {
		return $.ajax({
			type: "POST",
			url: _this.route() + "/documents",
			headers: {
				Accept: "application/vnd.vtex.masterdata.v10+json",
				"Content-Type": "application/json;charset=utf-8",
			},
			data: JSON.stringify(obj),
		});
	};

	this.search = function (condicao, campos) {
		if (condicao.length <= 0) return;

		return $.ajax({
			async: false,
			crossDomain: true,
			url:
				_this.route() +
				"/search?_where=" +
				condicao +
				"&_fields=" +
				campos,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/vnd.vtex.ds.v10+json",
				"REST-Range": "resources=0-10",
			},
		});
	};
}
// CustomNewsletterFormService

function CustomNewsletterFormController(service, opts) {
	var _this = this;
	_this.opts = opts;

	_this.createdForm = function createdForm(opts) {
		var $form = $("<form />", {
			name: "m3-custom-newsletter-form",
			class: "m3-custom-newsletter-form",
		});
		$form.append(createInterest(opts.interest));
		$form.append(createField("name", "nome", "text"));
		$form.append(createField("email", "email", "email"));
		$form.append(createField("button-ok", opts.textButtom, "button"));
		$form.append($("<div />", { class: "m3-cn-msg" }));

		return $form;
	};

	var removeAccents = function removeAccents(text) {
		return text
			.toLowerCase()
			.replace(/[áàâã]/g, "a")
			.replace(/[ìíĩî]/g, "i")
			.replace(/[éèê]/g, "e")
			.replace(/[óòôõ]/g, "o")
			.replace(/[úùû]/g, "u")
			.replace(/[ç]/g, "c")
			.replace(/[\:]/g, "");
	};

	var configureEventsCheckd = function configureEventsCheckd($form) {
		// sempre que alguma categoria for desmarcada, desmarcar checkbox 'todas' categorias
		$form.find(".m3-cn-checkbox").on("click", function (event) {
			if (!$(this).prop("checked")) {
				$(this)
					.parents("div")
					.eq(0)
					.find(".m3-cn-checkbox-all-interest")
					.prop("checked", false);
			}
		});
		// sempre que checkbox todas categorias, marcar todos os outros checkbox
		$form
			.find(".m3-cn-checkbox-all-interest")
			.on("click", function (event) {
				var $checkboxs = $(this)
					.parents("div")
					.eq(0)
					.find(".m3-cn-checkbox");

				if ($(this).prop("checked")) {
					$checkboxs.prop("checked", true);
				} else {
					$checkboxs.prop("checked", false);
				}
			});
	};
	/**
	 * Cria o Html com os campos de segmentação
	 * @param  {array} interest [campos de segmentação	]
	 * @return {object}        [Jquery element]
	 */
	var createInterest = function createInterest(interest) {
		var identificadorRandomico = Math.floor(Math.random() * 100 + 1),
			$interest = $("<div />", { class: "dynamic-fildset" });
		if (typeof interest == "object") {
			for (var i = 0; i < interest.length; i++) {
				var $field = $("<fieldset />", {
					class: "m3-cn-interest-container",
				}).appendTo($interest);
				createInterestTitle(interest[i]).appendTo($field);
				createInterestOpts(
					interest[i],
					identificadorRandomico
				).appendTo($field);
			}
		}
		return $interest;
	};

	var createField = function createField(nome, titulo, type) {
		nome = nome || "";
		nome = nome.trim();
		titulo = titulo || nome;
		titulo = titulo.trim();
		type = type || "text";

		var idFiel = "m3-cn-" + nome,
			$fieldset = $("<fieldset />", {
				class: "m3-cn-" + nome + "-container dynamic-fildset",
			}),
			$input = $("<input />", {
				id: idFiel,
				placeholder: titulo,
				name: idFiel,
				class: idFiel,
				type: type,
			});

		if (!isInputText(type)) {
			$input.val(titulo);
		} else {
			$("<label />", { for: idFiel, text: titulo }).appendTo($fieldset);
		}
		$input.appendTo($fieldset);

		return $fieldset;
	};
	var isInputText = function isInputText(type) {
		return (
			type === "text" ||
			type === "email" ||
			type === "date" ||
			type === "number" ||
			type === "password" ||
			type === "search" ||
			type === "tel" ||
			type === "url"
		);
	};

	var createdOption = function createdOption(
		id,
		title,
		inputClass,
		type,
		name
	) {
		inputClass = inputClass || "m3-cn-checkbox";
		type = type || "checkbox";
		name = name || "m3-cn-input-radio";

		var $span = $("<span />", { class: "m3-cn-option-interest" });
		$("<input />", {
			id: "m3-cn-" + id,
			class: "m3-cn-checkbox " + inputClass,
			type: type,
			name: name,
			val: title,
		}).appendTo($span);
		$("<label />", { for: "m3-cn-" + id, text: title }).appendTo($span);

		return $span;
	};

	var createInterestOpts = function createInterestOpts(interest, index) {
		var $fields = $("<div />");
		var segmentations = interest.segmentations;

		if (typeof segmentations == "object") {
			if (interest.choiceOfSegmentation != "radio")
				createdOption(
					index,
					"Todas",
					"m3-cn-checkbox-all-interest"
				).appendTo($fields);
			var titleField = removeAccents(interest.title);
			for (var i = 0; i < segmentations.length; i++) {
				var id = removeAccents(segmentations[i]) + "-" + index;
				createdOption(
					id,
					segmentations[i],
					"m3-cn-checkbox-" + titleField,
					interest.choiceOfSegmentation,
					titleField
				).appendTo($fields);
			}
		}
		return $fields;
	};

	var createInterestTitle = function createInterestTitle(interest) {
		var titleInterest = interest.description || interest.title;
		return $("<span />", {
			class: "m3-cn-interest-title",
			title: interest.title,
			text: titleInterest,
		});
	};

	/**
	 * Obtem os valores dos campos de interreses selecionados
	 * @return {obj} um objeto como {musica=>['Rock','Rap','Jazz']}
	 */
	var getInterestFieldsValue = function getInterestFieldsValue() {
		var interestFieldsValue = {};

		/**
		 * iterando todos os fieldsets e montando o array
		 * com o tipo de interesse e seu respectivo valor
		 */
		$form.find(".m3-cn-interest-container").each(function () {
			var key = removeAccents(
				$(this).find(".m3-cn-interest-title").attr("title")
			);

			var values = $(this)
				.find("input:checked")
				.not(".m3-cn-checkbox-all-interest")
				.map(function () {
					return $(this).val();
				})
				.get();

			if (values.length <= 0) {
				values = $(this)
					.find("input")
					.not(".m3-cn-checkbox-all-interest")
					.map(function () {
						return $(this).val();
					})
					.get();
			}

			interestFieldsValue[key] = values;
		});
		return interestFieldsValue;
	};

	/**
	 * @return {object} [description]
	 */
	_this.content = function content() {
		return service.create(
			$form.find(".m3-cn-name").val(),
			$form.find(".m3-cn-email").val(),
			getInterestFieldsValue(),
			$form.parent().data("origem")
		);
	};

	var showCoupon = function showCoupon() {
		if (typeof opts.coupon != "undefined") {
			if (opts.coupon.length > 0) {
				var coupon = $("<div />", {
					class: "m3-cn-coupon",
					text: opts.coupon,
				});
				$form.find(".m3-cn-msg").append(coupon);
			}
		}
	};

	var resetForm = function resetForm() {
		$form.each(function () {
			this.reset();
		});
	};
	var createMensage = function createMensage(text, type) {
		type = type || "error";
		return $("<span />", { class: "m3-cn-" + type, text: text });
	};
	_this.emailIsRegistered = function (email) {
		var resultado = [];
		service
			.search("m3ClientEmail=" + email, "m3ClientEmail")
			.done(function (data) {
				resultado = data;
			});

		if (resultado.length > 0) return true;

		return false;
	};
	_this.validate = function validate($form) {
		var email = $form.find(".m3-cn-email").val();
		if (email.length == 0) {
			$form
				.find(".m3-cn-msg")
				.empty()
				.append(createMensage("Por favor, informe o seu email!"));
			return false;
		} else {
			var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var result = regex.test(email);

			if (!result) {
				$form
					.find(".m3-cn-msg")
					.empty()
					.append(createMensage("Email inválido!"));
				return false;
			}

			if (_this.emailIsRegistered(email)) {
				$form
					.find(".m3-cn-msg")
					.empty()
					.append(createMensage("Este email já está cadastrado!"));
				return false;
			}

			return true;
		}
	};

	_this.success = function success() {
		var msg = createMensage(opts.successMsg, "success");

		$form.find(".m3-cn-msg").empty().append(msg);
		showCoupon();
		resetForm();

		$form.trigger("CN-registered-successfully");
	};

	_this.error = function error() {
		var msg = createMensage(opts.errorMsg);
		$form.trigger("CN-registered-filed");
		$form.find(".m3-cn-msg").empty().html(msg);
	};

	_this.save = function save() {
		$(this).prop("disable", true);
		//Define formulario que esta sendo usado
		$form = $(this).parents(".m3-custom-newsletter-form");

		// limpando a div de msg
		$form.find(".m3-cn-msg").empty();

		if (_this.validate($form)) {
			var obj = _this.content();

			var jqXHR = service.add(obj);

			jqXHR
				.done(_this.success)
				.fail(_this.error)
				.always(function () {
					$(".m3-cn-button-ok").prop("disable", false);
				});
		}
	};

	// Configura os eventos do formulário
	_this.configure = function configure($el) {
		var $form = _this.createdForm(_this.opts);
		configureEventsCheckd($form);
		$form.find(".m3-custom-newsletter-form").submit(false);
		$form.find(".m3-cn-button-ok").on("click", _this.save);

		$form.appendTo($el);
	};
} // CustomNewsletterFormController

$.fn.CustomNewsletter = function (options) {
	var opts = $.extend({}, $.fn.CustomNewsletter.defaults, options);

	var service = new CustomNewsletterFormService(opts);
	var controller = new CustomNewsletterFormController(service, opts);

	$(this).each(function (index, el) {
		controller.configure($(this));

		if (opts.executeCallback) {
			$(this).on("CN-registered-successfully", function () {
				var $form = $(this),
					$msgContatiner = $form.find(".m3-cn-msg"),
					$a = $("<a />", {
						text: "Voltar",
						href: "#",
						class: "btn-voltar",
					}).click(function (event) {
						event.preventDefault();
						$form
							.find(
								".m3-cn-name-container,.m3-cn-email-container,.m3-cn-button-ok-container"
							)
							.show("slow");
						$msgContatiner.empty();
					});
				$msgContatiner.append($a);
				$form
					.find(
						".m3-cn-name-container,.m3-cn-email-container,.m3-cn-button-ok-container"
					)
					.hide("slow");
			});
		}
	});
};

$.fn.CustomNewsletter.defaults = {
	acronymEntity: "CN",
	shop: "minha-loja",
	textButtom: "Enviar",
	errorMsg: "Ocorreu algum erro, tente novamente mais tarde.",
	successMsg: "Cadastro concluído com sucesso!",
	coupon: "",
	executeCallback: true,
	interest: [],
	/*
	,"interest"		:	[
		{
			'title':"Titulo Segmentação",
			'description':"Texto descrevendo segmentação",
			'choiceOfSegmentation':'checkbox',
			'segmentations':[
				"Segmentação-01",
				"Segmentação-02"
			]
		}
	]*/
};
