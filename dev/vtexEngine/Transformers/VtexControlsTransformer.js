const { regexFindAll, findInArray } = require("../utils");

class VtexControlsTransformer {
	constructor(regex, controls, validator) {
		this.regex = regex;
		this.controls = controls;
		this.validator = validator;
	}
	transform(fileContent) {
		const regex = new RegExp(this.regex.controle);
		const regexResult = regexFindAll(regex, fileContent);

		return this._processRegResult(fileContent, regexResult);
	}

	_processRegResult(fileContent, regexResult) {
		regexResult.forEach((reResult) => {
			const [tag, id] = reResult;
			let conteudo;
			const file = findInArray(this.controls, id);

			if (file !== null) {
				conteudo = file.content;
			} else {
				console.log(`Controle de ID: ${id} não foi encontrado`);
				conteudo = `<!-- no match for ${id} -->`;
			}

			fileContent = fileContent.replace(tag, conteudo);
		});

		return fileContent;
	}
}

module.exports = VtexControlsTransformer;
