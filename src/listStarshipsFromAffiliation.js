const Puppeteer = require('puppeteer');
const fs = require('fs');
const LINKS = require('./affiliationsLinks.json')
// const LINKS = [{
// 	"link": "https://starwars.fandom.com/wiki/Category:Airam_starships",
// 	"name": "Category:Airam starships"
// },]

async function run() {
	const browser = await Puppeteer.launch()
	const starshipsByAffiliations = await Promise.all(
		await LINKS.map(async (link) => {
			const page = await browser.newPage()
			await page.goto(link.link)

			console.log(link.name)

			return {
				...link,
				starshipsLinks: await page.evaluate((props) => {
					const starshipsList = Array.from(document.querySelectorAll('.category-page__member'))

					const linksFilter = starshipsList
						.filter(s => s.querySelector('div a img'))
						.map(s => s.querySelector('.category-page__member-link'))

					return linksFilter.map(s => ({
						link: s.href,
						name: s.innerHTML
					}))
				})
			}
		})
	)

	await browser.close()

	let data = JSON.stringify(starshipsByAffiliations);
	fs.writeFileSync('./starshipsByAffiliations.json', data);

	console.log(starshipsByAffiliations)
}

run()