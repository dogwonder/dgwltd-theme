import { test, expect } from '@playwright/test';
import { add, subtract } from '../src/tests/calculator.js';

test.describe('calculator.js', () => {

	test('add()', async () => {

		// Should add two or more numbers together
		expect(add(4, 6, 8)).toEqual(18);

		// Should return the original value when one number is provided
		expect(add(42)).toEqual(42);

		// Should return 0 if no numbers are provided
		expect(add()).toEqual(0);

	});

	test('subtract()', async () => {

		// Should subtract two or more numbers
		expect(subtract(8, 3, 2)).toEqual(3);

		// Should return the original value when one number is provided
		expect(subtract(42)).toEqual(42);

		// Should return 0 if no numbers are provided
		expect(subtract()).toEqual(0);

	});

});
