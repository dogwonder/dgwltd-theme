import dayjs from 'dayjs';

export default function(eleventyConfig) {

	// Add date filter
	eleventyConfig.addFilter('date', (date, dateFormat) => {
		return dayjs(date).format(dateFormat);
	});
	
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Convert to dayjs
		// If zone is provided, use it, otherwise use UTC
		const date = zone 
		  ? dayjs(dateObj).tz(zone) 
		  : dayjs(dateObj).utc();
		
		// Format using dayjs format tokens
		// Default format 'DD MMMM YYYY' is equivalent to Luxon's 'dd LLLL yyyy'
		return date.format(format || "DD MMMM YYYY");
	  });

	  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// Convert to dayjs and format for HTML date string (YYYY-MM-DD)
		return dayjs(dateObj).utc().format('YYYY-MM-DD');
	  });

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
	});

	// Add a custom filter to hyphenate values like xl, 2xl, 3xl, etc.
	eleventyConfig.addNunjucksFilter('hyphenate', (value) => {
		return value.replace(/(\d*)(xl|xs)/g, (match, p1, p2) => {
			return p1 ? `${p1}-${p2}` : `${p2}`;
		});
	});

	// Add a custom filter to remove 'rem' and multiply by 16
	eleventyConfig.addNunjucksFilter('remToPx', (value) => {
		const numericValue = parseFloat(value.replace('rem', ''));
		return numericValue * 16;
	});

	// Add parseJson filter
	eleventyConfig.addFilter('parseJson', (jsonString) => {
		try {
		  return JSON.parse(jsonString);
		} catch (error) {
		  console.error('Error parsing JSON:', error);
		  return [];
		}
	});

};
