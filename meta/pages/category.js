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
					contents: [
						{
							name: "metaTag",
							active: true,
							content: `<meta name='language' content='pt-Br'>`,
						},
					],
				},
			],
		},
	],

	// Ainda não implementado
	//Trocar pelo que for cadastrado na vtex
	searchResultLayoutID: "46b0e7f2-15ee-4789-a75e-280e389d2b8f",
};
