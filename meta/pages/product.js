module.exports = {
	contentPlaceHolders: [
		{
			// Registra  o contentPlaceholder
			id: "htmlSeo",
			objects: [
				//  Registra os objetos vtex
				{
					type: "html",
					name: "Html SEO",
					contents: [],
				},
			],
		},
		{
			id: "prateleira-padrao",
			objects: [
				{
					type: "Produtos Relacionados",
					name: "prateleira",
					properties: {
						layout: "prateleira-padrao",
						type: "QuemViuViuTambem",
						"number-of-columns": 12,
						"number-of-items": 12,
					},
				},
			],
		},
		// EXEMPLO DE PRATELEIRA COMUM
		// {
		// 	id: "prateleira-padrao",
		// 	objects: [
		// 		{
		// 			type: "colecao",
		// 			name: "prateleira",
		// 			properties: {
		// 				layout: "prateleira-padrao",
		// 				"number-of-columns": 12,
		// 				"number-of-items": 12,
		// 				"show-unavailable": false,
		// 				//sim random está escrito errado e é culpa da vtex
		// 				ramdom: false,
		// 				paged: false,
		// 			},
		// 			contents: [
		// 				{
		// 					name: "praleira",
		// 					active: true,
		// 					clusterId: 158,
		// 				},
		// 			],
		// 		},
		// 	],
		// },
	],
};
