/**
 * Add two or more numbers together
 * @param  {...Number} nums The numbers to add together
 * @return Number            The total
 */
export function add (...nums) {
	let total = 0;
	for (let num of nums) {
		total = total + num;
	}
	return total;
}

/**
 * Add two or more numbers together
 * @param  {...Number} nums The numbers to add together
 * @return Number            The total
 */
export function subtract (...nums) {
	let total = nums.shift() || 0;
	for (let num of nums) {
		total = total - num;
	}
	return total;
}
