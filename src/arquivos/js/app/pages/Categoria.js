import "Lib/smartResearch";
import { isSmallerThen768 } from "Helpers/MediasMatch";
import PrateleiraService, {
	UPDATE_SHELF,
} from "App/components/Prateleira/PrateleiraService";

/*
 * paginaDeCategoria
 * Página 'utilizadas': categoria, derpartamento e resultado de resultado-busca.
 */
export default class Categoria {
	constructor(ctx) {
		this.prateleiraService = ctx.getService(PrateleiraService.name);
		this.reposicionarSelectDeOrdenacao();

		if (isSmallerThen768) {
			this.toggleFiltersMobile();
			this.filterMobileExtraInfo();
		}
		this.smartResearch();
		this.renderCategoryFilter();
	}

	toggleFiltersMobile() {
		$("#open-filter-button").on("click", function () {
			$(".filtros-categoria").addClass("mobile-open");
		});

		$("#close-filter-button, .aply-filter-btn").on("click", function () {
			$(".filtros-categoria").removeClass("mobile-open");
		});
	}

	filterMobileExtraInfo() {
		var atualizarContagemDeFiltrosAtivos = function () {
			var opcoesFiltro = $(
				".search-multiple-navigator .multi-search-checkbox"
			);
			var qtd = 0;

			for (var i in opcoesFiltro) {
				var opcao = opcoesFiltro[i];
				if (opcao.checked) {
					qtd++;
				}
			}

			var button = $("#open-filter-button");

			if (qtd > 0) {
				button.find("span").remove();
				$("<span/>", { text: "(" + qtd + ")" }).appendTo(button);

				$(".topo-resultado .clear-filter-btn").addClass("active");
			} else {
				button.find("span").remove();
				$(".topo-resultado .clear-filter-btn").removeClass("active");
			}
		};

		//Para browsers que mantém os checkboxes selecionados ao atualizar a página
		atualizarContagemDeFiltrosAtivos();

		$(".aply-filter-btn").on("click", function () {
			atualizarContagemDeFiltrosAtivos();
		});

		$(".topo-resultado .clear-filter-btn").on("click", function () {
			$("#open-filter-button").find("span").remove();

			$(".multi-search-checkbox").each(function () {
				if ($(this).is(":checked")) {
					$(this).attr("checked", false).trigger("change");
				}
			});

			$(this).removeClass("active");
		});
	}

	reposicionarSelectDeOrdenacao() {
		$(".orderBy").eq(0).appendTo(".topo-resultado .opcoes-resultado");
	}

	createCategoryFilter() {
		let departmentFilter = $("<fieldset />", {
			class: "refino links-departamento",
		});
		let list = $("<div />");
		let navSingle = $(".search-single-navigator");
		let subcategories = navSingle.find("h4,h3,h5");

		subcategories.each(function (i, li) {
			let item = $("<label />", {
				class: "item",
			});

			if ($(li).find("a").length > 0) {
				let link = $(li).find("a");
				link.text(link.attr("title"));
				item.html(link);
				item.appendTo(list);
			}
		});

		$("<h5 />", {
			text: "Categoria",
		}).appendTo(departmentFilter);

		list.appendTo(departmentFilter);

		return departmentFilter;
	}

	renderCategoryFilter() {
		try {
			var navMultiple = $(".search-multiple-navigator");
			var categoryFilter = this.createCategoryFilter();
			categoryFilter.insertBefore(navMultiple.find("fieldset:first"));
		} catch (error) {
			console.log(error);
		}
	}

	smartResearch() {
		let opcoesVtexSmartResearch = {
			menuDepartament: ".menu-departamento",
			loadContent: ".produtos-da-categoria [id^=ResultItems]",
			shelfClass: "[class$=colunas]",
			mergeMenu: false,
			authorizeUpdate: () => true,
			emptySearchMsg:
				"<h3>Não encontramos nenhum resultado para seu filtro!</h3>",
			clearButtonClass: ".clear-filter-btn",
			// valores permitidos ['load-more','pagination','infinit-scroll']
			methodPageLoad: "load-more",
			loadMoreText: "Ver mais",
			shelfCallback: () => {
				this.prateleiraService.events.publish(UPDATE_SHELF);
			},
		};
		if (isSmallerThen768) {
			opcoesVtexSmartResearch.filterOnChange = false;
			opcoesVtexSmartResearch.filterButtonClass = ".aply-filter-btn";
		}

		$(".navigation-tabs input[type='checkbox']").vtexSmartResearch(
			opcoesVtexSmartResearch
		);

		$(document).on("vsr-request-end", () => {
			this.prateleiraService.events.publish(UPDATE_SHELF);
		});
		$(window).on("finished-upadte-filter", () => {
			this.prateleiraService.events.publish(UPDATE_SHELF);
		});
		// desabilita o scroll automático
		history.scrollRestoration = "manual";
	}
}
