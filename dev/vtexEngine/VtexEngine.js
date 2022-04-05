const VtexPlaceHolderTransformer = require("./Transformers/placeholder/VtexPlaceHolderTransformer");
const VtexControlsTransformer = require("./Transformers/VtexControlsTransformer");
const VtexSubTemplateTransformer = require("./Transformers/VtexSubTemplateTransformer");
const VtexEngineValidator = require("./VtexEngineValidator");

class VtexEngine {
	constructor(files, metaData, regex) {
		this.validator = new VtexEngineValidator();
		this.subTemplateTransformer = new VtexSubTemplateTransformer(
			regex,
			files.subtemplates,
			this.validator
		);
		this.controlsTransformer = new VtexControlsTransformer(
			regex,
			files.controles,
			this.validator
		);
		this.placeHolderTransformer = new VtexPlaceHolderTransformer(
			regex,
			metaData,
			files.prateleiras,
			this.validator
		);
	}

	process(fileContent, fileMeta, transformCTX) {
		fileContent = this.placeHolderTransformer.transform(
			fileContent,
			fileMeta
		);

		fileContent = this.subTemplateTransformer.transform(
			fileContent,
			fileMeta
		);

		fileContent = this.controlsTransformer.transform(fileContent, fileMeta);

		fileContent = this._removeEspecialTags(fileContent, fileMeta);

		fileContent = this.validator.notClosedTags(fileContent);

		return fileContent;
	}

	_removeEspecialTags(fileContent) {
		fileContent = fileContent.replace("<vtex:metaTags />", "");

		return fileContent;
	}
}

module.exports = VtexEngine;
