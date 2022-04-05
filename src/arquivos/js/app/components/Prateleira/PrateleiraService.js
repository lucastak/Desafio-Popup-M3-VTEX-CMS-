import { PubSub } from "@agenciam3/pkg";

export const UPDATE_SHELF = "UPDATE_SHELF";

export default class PrateleiraService {
	constructor() {
		this.events = new PubSub();
	}
}
