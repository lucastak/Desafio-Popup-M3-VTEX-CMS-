function base(obj, cb) {
	let result = "";
	obj.contents.forEach((content) => {
		if (content.length === 0) return;
		if (content.active) {
			result = cb(content, result);
		}
	});

	return result;
}

function banner(obj) {
	function createBanner(content, string) {
		return (string += `
				<div class="box-banner">
					<a href="/">
						<img  alt="Promoções" src="/arquivos/${content.file}" />
					</a>
				</div>`);
	}

	return base(obj, createBanner);
}

function colecao(obj, shelfs) {
	const shelf = shelfs.find((shelf) => shelf.name === obj.properties.layout);
	const shelfCount = obj.properties["number-of-items"];
	const shelfItem = [...Array(shelfCount).keys()].map(
		(i) => `
		<li layout="id da prateleira" class="nome-da-colecao">
			${shelf.content}
		</li>
	`
	);
	const html = `
		<div class="prateleira n20colunas">
			<h2>${obj.name}</h2>
			<ul>
				${shelfItem}
			</ul>
		</div>
	`;

	return html;
}

function html(obj) {
	function createHtmlContent(content, string) {
		return (string += content.content);
	}

	return base(obj, createHtmlContent);
}

function text(obj) {
	return html(obj);
}

function productRelational(obj, shelfs) {
	return colecao(obj, shelfs);
}

module.exports = {
	banner,
	colecao,
	html,
	text,
	"Produtos Relacionados": productRelational,
};
