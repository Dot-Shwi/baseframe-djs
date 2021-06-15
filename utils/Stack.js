const Err = require("./Err");
const Main = require("./Main");
class Stack extends Main {
	/**
	 * Create a stack
	 * @param {String} name Name of the stack
	 * @param {any} requireItemsToBe Require the stack items to be an instance of a particular class
	 */
	constructor(name = "Stack", requireItemsToBe = "any") {
		super(name);
		this.stackName = name;
		this.top = -1;
		this.items = {};
		this.requireItemsToBe = requireItemsToBe || "any";
	}

	push(item) {
		if (
			this.requireItemsToBe !== "any" &&
			!(item instanceof this.requireItemsToBe)
		)
			return new Err(
				`Item must be an instance of ${this.requireItemsToBe.name}!`,
				"INVALID_ITEM"
			);
		this.top = this.top + 1;
		this.items[this.top] = item;
	}

	pop() {
		const top_item = this.top_item;
		this.items[this.top] = null;
		this.top--;
		return top_item;
	}

	set(index, item) {
		if (
			this.requireItemsToBe !== "any" &&
			!(item instanceof this.requireItemsToBe)
		)
			return new Err(
				`Item must be an instance of ${this.requireItemsToBe.name}!`,
				"INVALID_ITEM"
			);
		if (index > this.top)
			return new Err(
				"Index must be smaller than total items!",
				"INVALID_INDEX",
				{ index, item }
			);
		this.items[index] = item;
	}

	log(index = "all") {
		let item_array = [];
		switch (index) {
			case "all":
				for (let i = 0; i <= this.top; i++) {
					item_array.push(this.item(i));
				}
				break;

			case "top":
				item_array.push(this.top_item);
				break;

			default:
				if (!isNaN(index)) {
					item_array.push(this.item(index));
				}
				break;
		}
		this.InLog(item_array);
	}

	item(index = this.top) {
		if (index > this.top || index < 0 || isNaN(index))
			return new Err(
				"Index is bigger than total items or smaller than 0 or not a number!",
				"INVALID_INDEX",
				{ dont_log: true }
			);
		return this.items[index];
	}

	get total_items() {
		return this.top + 1;
	}

	get top_item() {
		return this.items[this.top];
	}
}

const ErrorStack = new Stack("ErrorStack", Err);

module.exports = { Stack, ErrorStack };

/**  TESTING  */
ErrorStack.push(new Err("ERROROROR"));
ErrorStack.push(new Err("Hellooo"));
ErrorStack.log();
