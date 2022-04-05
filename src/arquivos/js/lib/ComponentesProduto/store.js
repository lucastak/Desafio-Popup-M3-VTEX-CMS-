import { Store } from "@agenciam3/pkg";

export const ComponentStore = function (storeOpts = {}) {
	return new Store({
		moduleName: storeOpts.moduleName || "ProductComponens",
		state: {
			selectedSku: {},
			qtd: 1,
			...storeOpts.state,
		},
		mutations: {
			setSelectedSku(state, selectedSku) {
				state.selectedSku = selectedSku;
			},
			setQtd(state, qtd) {
				state.qtd = qtd;
			},
			...storeOpts.mutations,
		},
		actions: { ...storeOpts.actions },
	});
};
