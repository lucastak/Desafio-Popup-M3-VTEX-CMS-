const chalk = require("chalk");

module.exports = class VtexEngineValidator {
	metaDataPlaceHolderRepeated(file, metaData) {
		metaData.pages.forEach((pageData) => {
			let ids = {};
			let dups = [];
			pageData.data.contentPlaceHolders.forEach((val) => {
				if (ids[val.id]) {
					dups.push(val);
				} else {
					ids[val.id] = true;
				}
			});
			if (dups.length > 0) {
				console.log(
					chalk.red(
						`\n\n O ID: "${dups[0].id}" foi encontrado multiplas vezes no template: "${pageData.template}" \n\n`
					)
				);
				file += this._memeContent("https://i.imgflip.com/4fkkcz.jpg");
			}
		});

		return file;
	}

	placeHolderRepeated(file, regResult, basename) {
		let ids = {};
		let dups = [];
		regResult.forEach((regexec) => {
			if (ids[regexec[1]]) {
				dups.push(regexec[1]);
			} else {
				ids[regexec[1]] = true;
			}
		});
		if (dups.length > 0) {
			console.log(
				chalk.red(
					`\n\n  O ID: "${dups[0]}" foi encontrado multiplas vezes no template: "${basename}" \n\n`
				)
			);
			file += this._memeContent("https://i.imgflip.com/4fkkcz.jpg");
		}

		return file;
	}

	subTemplatesWithContentPlaceholder(fileContent, subtemplates, regex) {
		subtemplates.forEach((template) => {
			const placeholderRegex = new RegExp(regex.placeholder);
			const regexResult = placeholderRegex.exec(template.content);

			if (regexResult) {
				fileContent += this._memeContent(
					"https://i.imgflip.com/4fkgnr.jpg"
				);
				console.log(
					chalk.red(
						`  \n\n Subtemplates não podem ter contentplaceholder `
					)
				);
				console.log(
					chalk.red(
						`O Subtemplate "${template.name}" possui um contentPlaceholder \n\n`
					)
				);
			}
		});
		return fileContent;
	}

	notClosedTags(fileContent) {
		const reImgNotClosed = new RegExp(/(<img("[^"]*"|[^\/">])*)>/gi);
		const reInputNotClosed = new RegExp(/(<input("[^"]*"|[^\/">])*)>/gi);

		const imgTest = reImgNotClosed.exec(fileContent);
		const inputTest = reInputNotClosed.exec(fileContent);

		if (imgTest)
			console.log(
				chalk.red(
					`\n\n A Tag: ${imgTest[0]} não foi fechada corretamente \n\n`
				)
			);
		if (inputTest)
			console.log(
				chalk.red(
					`\n\n A Tag: ${inputTest[0]} não foi fechada corretamente \n\n`
				)
			);

		return fileContent;
	}

	_memeContent(memeUrl) {
		return `
		<div style="position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		z-index: 999;
		opacity: 1;
		pointer-events: none;
		transition: 0.2s;
		background: rgba(0,0,0,0.5);">
			<img src="${memeUrl}" style="
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			" />
		</div>
	`;
	}
};
