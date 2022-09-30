const Puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
	const browser = await Puppeteer.launch()

	const page = await browser.newPage()
	await page.goto('https://starwars.fandom.com/pt/wiki/Categoria:Naves_por_afiliação', { timeout: 0 })

	const links = await page.evaluate((props) => {
		const tagLinks = document.getElementsByClassName('category-page__member-link')

		const nameCategories = []

		for (let index = 0; index < tagLinks.length; index++) {
			const element = tagLinks[index];
			nameCategories.push(element.innerText)
		}

		return nameCategories
	})

	console.log({
		links
	})

	// let data = JSON.stringify(links);
 	// fs.writeFileSync('./links.json', data);

	await browser.close()
}

run()