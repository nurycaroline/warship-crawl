const starships = require('./starships.json');
const fs = require('fs');

function getAffiliations() {
	const affiliations = [].concat(...[...new Set(starships.map(s => s.affiliation))])
	const affiliationList = [...new Set(affiliations)]

	let data = JSON.stringify(affiliationList);
	fs.writeFileSync('data/affiliations.json', data);

	return {
		affiliationList
	}
}

getAffiliations()