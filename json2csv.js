const fs = require("fs");
const { parse } = require('json2csv');

// 1. Load your JSON file
const jsonData = JSON.parse(fs.readFileSync("countries_info.json"));


// 2. fields in CSV
const fields = [ 'country', 'endangered species', 'animal', 'dish', 
		'tree', 'capital', 'official language', 'national day',
  		'national day info','anthem' ];

const opts = { fields };

try {
	const csv = parse(jsonData, opts);
	fs.writeFileSync('countries_info.csv', csv);
	console.log('CSV file successfully created!');
} catch (err) {
  	console.error(err);
}

console.log("CSV file created successfully!");

