const { regexFindAll } = require("../../utils");
const placeHolderTransformStrategy = require("./placeHolderTransformStrategy");
const chalk = require("chalk");

class VtexPlaceHolderTransformer {
	constructor(regex, metaData, shelfs, validator) {
		this.regex = regex;
		this.metaData = metaData;
		this.shelfs = shelfs;
		this.validator = validator;
	}

	transform(fileContent, { basename }) {
		const regex = new RegExp(this.regex.placeholder);
		const regexResult = regexFindAll(regex, fileContent);

		fileContent = this.validator.placeHolderRepeated(
			fileContent,
			regexResult,
			basename
		);

		fileContent = this.validator.metaDataPlaceHolderRepeated(
			fileContent,
			this.metaData
		);

		return this._processRegResult(fileContent, regexResult, basename);
	}

	_processRegResult(file, regexResult, basename) {
		let transformedFile = file;
		regexResult.forEach((reResult) => {
			const pageData = this._getPageData(basename);
			const pagePlaceHolderData = this._getPagePlaceholderData(
				pageData,
				reResult
			);

			transformedFile = this._processPlaceHolder(
				transformedFile,
				pagePlaceHolderData
			);
		});

		return transformedFile;
	}

	_processPlaceHolder(transformedFile, pagePlaceHolderData) {
		if (
			pagePlaceHolderData.placeHolderData === false ||
			pagePlaceHolderData.placeHolderData === undefined
		) {
			console.log(
				"Placeholder não registrado na meta de ID:",
				pagePlaceHolderData.id
			);
			return transformedFile.replace(
				pagePlaceHolderData.vtexTag,
				`<!-- Conteudo não registrado de tag: ${pagePlaceHolderData.vtexTag} -->`
			);
		}

		let result = "";

		pagePlaceHolderData.placeHolderData.objects.forEach((object) => {
			const strategy = placeHolderTransformStrategy[object.type];
			if (typeof strategy === "undefined") return transformedFile;
			// não ta legal mas passo as prateleiras como segundo paramentro
			result += strategy(object, this.shelfs);
		});

		return transformedFile.replace(pagePlaceHolderData.vtexTag, result);
	}

	_getPagePlaceholderData(pageData, reResult) {
		const [found, idValue, ...extra] = reResult;
		const id = idValue.split('"')[0];

		if (typeof pageData !== "undefined") {
			const placeHolderData = pageData.data.contentPlaceHolders.find(
				(contentPlaceholder) => contentPlaceholder.id === id
			);

			if (typeof placeHolderData === "undefined") {
				console.log(
					`contentPlaceholder de ID: ${id} não foi encontrado`
				);
				return {
					vtexTag: found,
					placeHolderData: false,
					id,
				};
			}

			return {
				vtexTag: found,
				placeHolderData,
				id,
			};
		}

		return {
			vtexTag: found,
			placeHolderData: false,
			id,
		};
	}

	_getPageData(basename) {
		return this.metaData.pages.find((data) => {
			return data.template === basename;
		});
	}
}

module.exports = VtexPlaceHolderTransformer;
