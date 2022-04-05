const { regexFindAll, findInArray } = require("../utils");

class VtexSubTemplateTransformer {
	constructor(regex, subtemplate, validator) {
		this.regex = regex;
		this.subTemplates = subtemplate;
		this.validator = validator;
	}
	transform(fileContent) {
		const regex = new RegExp(this.regex.subtemplate);

		fileContent = this.validator.subTemplatesWithContentPlaceholder(
			fileContent,
			this.subTemplates,
			this.regex
		);

		const regexResult = regexFindAll(regex, fileContent);

		return this._processRegResult(fileContent, regexResult);
	}

	_processRegResult(fileContent, regexResult) {
		regexResult.forEach((reResult) => {
			const [tag, id] = reResult;

			let conteudo;
			const file = findInArray(this.subTemplates, id);

			if (file !== null) {
				conteudo = file.content;
			} else {
				console.log(`Subtemplate de ID: ${id} não foi encontrado`);
				conteudo = `<!-- no match for ${id} -->`;
			}

			fileContent = fileContent.replace(tag, conteudo);
		});

		return fileContent;
	}
}

module.exports = VtexSubTemplateTransformer;
