export default class MasterData {
	/**
	 *
	 * @param {String} entityName - Singla da entidade do masterData
	 */
	constructor(entityName) {
		this.entityName = entityName;
		this.url = `/api/dataentities/${entityName}/`;
		this.urlDoc = `/api/dataentities/${entityName}/documents/`;

		this.baseHeaders = {
			Accept: "application/vnd.vtex.ds.v10+json",
			"Content-Type": "application/json",
		};
	}

	/**
	 * Realiza uma request http para o MasterData pela rota:
	 *  - https://developers.vtex.com/reference/search
	 * @param {} query - objecto com os query params
	 * @param {} headers - Objeto com as informaçoes do cabeçalho da request
	 *
	 */
	search(query = {}, headers = {}) {
		const params = new URLSearchParams(query).toString();
		return fetch(`${this.url}search/?${params}`, {
			method: "GET",
			headers: this._mergedHeaders(headers),
		});
	}

	indices(query = {}, headers = {}) {
		const params = new URLSearchParams(query).toString();
		return fetch(`${this.url}indices/?${params}`, {
			method: "GET",
			headers: this._mergedHeaders(headers),
		});
	}

	get(id) {
		return fetch(this.urlDoc + id, {
			method: "GET",
			headers: this._mergedHeaders(),
		});
	}

	post(data) {
		return fetch(this.urlDoc, {
			method: "POST",
			body: JSON.stringify(data),
			headers: this._mergedHeaders(),
		});
	}

	patch(data) {
		return fetch(this.urlDoc, {
			method: "PATCH",
			body: JSON.stringify(data),
			headers: this._mergedHeaders(),
		});
	}

	put(data) {
		return fetch(this.urlDoc, {
			method: "PATCH",
			body: JSON.stringify(data),
			headers: this._mergedHeaders(),
		});
	}

	delete(id) {
		return fetch(this.urlDoc + id, {
			method: "DELETE",
			headers: this._mergedHeaders(),
		});
	}

	getAttachment(id, field, fileName) {
		return fetch(`${this.urlDoc}${id}/${field}/attachments/${fileName}`, {
			method: "GET",
		});
	}

	_mergedHeaders(headers) {
		let mergedHeaders = {};
		Object.keys(headers).forEach((key) => {
			mergedHeaders[key] = headers[key];
		});
		Object.keys(this.baseHeaders).forEach((key) => {
			mergedHeaders[key] = this.baseHeaders[key];
		});

		return new Headers(mergedHeaders);
	}
}
