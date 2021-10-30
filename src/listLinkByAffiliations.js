const Puppeteer = require('puppeteer');
const fs = require('fs');
const LINK = 'https://starwars.fandom.com/wiki/Category:Starships_by_affiliation'

async function run() {
	const browser = await Puppeteer.launch()

	const page = await browser.newPage()
	await page.goto(LINK)

	const affiliations = await page.evaluate((props) => {
		const aList = Array.from(document.querySelectorAll('.category-page__member-link'))
		const links = aList.map(a => ({
			link: a.href,
			name: a.innerHTML,
		}))
		return links
	})
	await browser.close()

	let data = JSON.stringify(affiliations);
	fs.writeFileSync('./affiliationsLinks.json', data);
}

run()