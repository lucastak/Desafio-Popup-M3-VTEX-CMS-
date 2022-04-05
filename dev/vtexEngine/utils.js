module.exports = {
	regexFindAll(re, string) {
		let regexResult = [];
		while ((match = re.exec(string)) != null) {
			regexResult.push(match);
		}
		return regexResult;
	},
	findInArray(lista, name) {
		for (let i = 0; i < lista.length; i++) {
			if (lista[i].name == name.trim().toLowerCase()) {
				return lista[i];
			}
		}
		return null;
	},
};
