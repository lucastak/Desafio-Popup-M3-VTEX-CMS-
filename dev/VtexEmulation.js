var Transform = require("stream").Transform;
const path = require("path");
const VtexEngine = require("./vtexEngine/VtexEngine");

var PLUGIN_NAME = "VTEX_EMULATION";

var files = {
	subtemplates: [],
	controles: [],
	prateleiras: [],
};

var VtexEmulation = function () {
	this._folders = {};
	this._regex = {};

	this.folders({
		template: "./src/template-pagina/",
		subTemplate: "./src/sub-templates/",
		controle: "./dev/controles-vtex/",
		controleCustomizado: "./src/controle-customizado/",
		prateleira: "./src/template-prateleira/",
		metaData: "./meta/loja.js",
	});
	this.regex({
		subtemplate: /<vtex:template id="(.*)" ?\/>/g,
		controle: /<vtex\.cmc:([^ \>]*)[^\>]* ?\/>/g,
		placeholder: /<vtex:contentPlaceHolder id="(.*)" (.*) ?\/>/g,
	});
};

VtexEmulation.prototype.startEngine = function () {
	this.loadSubTemplates();
	this.loadPrateleira();
	this.loadControles();
	const metaPath = path.join(process.cwd(), this._folders.metaData);
	const metaData = require(metaPath);
	this.vtexEngine = new VtexEngine(files, metaData, this._regex);
};

VtexEmulation.prototype.process = function () {
	const transformStream = new Transform({ objectMode: true });
	const _this = this;
	/**
	 * @param {Buffer|string} file
	 * @param {string=} encoding - ignored if file contains a Buffer
	 * @param {function(Error, object)} callback - Call this function (optionally with an
	 *          error argument and data) when you are done processing the supplied chunk.
	 */
	transformStream._transform = function (file, encoding, callback) {
		const fileContent = file.contents.toString(encoding);
		//Meta dado associado pelo gulp https://gulpjs.com/docs/en/api/vinyl/
		const fileMeta = {
			basename: file.basename,
			relative: file.relative,
			dirname: file.dirname,
			path: file.path,
		};

		const processedFile = _this.vtexEngine.process(
			fileContent,
			fileMeta,
			this
		);

		file.contents = Buffer.from(processedFile, encoding);

		var error = null,
			output = file;
		callback(error, output);
	};

	return transformStream;
};

// get/set
VtexEmulation.prototype.regex = function (regex) {
	if (undefined != typeof regex) {
		this._regex = Object.assign(this._regex, regex);
	}
	return this._regex;
};

VtexEmulation.prototype.folders = function (folders) {
	if (undefined != typeof folders) {
		this._folders = Object.assign(this._folders, folders);
	}
	return this._folders;
};
VtexEmulation.prototype.loadSubTemplates = function () {
	files.subtemplates = makeListFileContent(this.folders().subTemplate);
};
VtexEmulation.prototype.loadPrateleira = function () {
	files.prateleiras = makeListFileContent(this.folders().prateleira);
};
VtexEmulation.prototype.loadControles = function () {
	var controles = makeListFileContent(this.folders().controle);
	var customizados = makeListFileContent(this.folders().controleCustomizado);
	files.controles = controles.concat(customizados);
};

var makeListFileContent = function (folder) {
	var fs = require("fs");
	var files = [];

	fs.readdirSync(folder).forEach((name) => {
		var file = {};
		file.name = name
			.substring(0, name.lastIndexOf("."))
			.trim()
			.toLowerCase();
		file.content = fs.readFileSync(folder + name, "utf8");
		files.push(file);
	});
	return files;
};

module.exports = new VtexEmulation();
