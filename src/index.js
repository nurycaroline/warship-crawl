const Puppeteer = require('puppeteer');
const fs = require('fs');
const LINKS = require('./links');

async function run() {
	const browser = await Puppeteer.launch()

	const starships = await Promise.all(
		LINKS.map(async (link) => {
			const page = await browser.newPage()
			await page.goto(link)

			const ship = await page.evaluate((props) => {
				const aside = document.querySelector('.mw-parser-output aside')

				const formatValueDiv = (data) => {
					return (
						aside
							.querySelector(data)
							?.querySelector('div')
							?.innerText?.replace(/\[\d+\]/g, '') || null
					)
				}

				const formatAffiliation = (affiliations) => {
					return affiliations && affiliations.split('\n').map(a => a.replace('/n', ''))
				}

				const image = aside.querySelector('[data-source = image] a')?.href
				const name = aside.querySelector('[data-source = name]')?.innerText
				const model = formatValueDiv('[data-source = model]')
				const length = formatValueDiv('[data-source = length]')
				const maxSpeed = formatValueDiv("[data-source = 'max speed']")?.split('(')[0].trim()
				const megalight = formatValueDiv('[data-source = mglt]')
				const width = formatValueDiv('[data-source = width]')
				const height = formatValueDiv('[data-source = height]')
				const passengers = formatValueDiv('[data-source = passengers]')
				const capacity = formatValueDiv('[data-source = capacity]')
				const cost = formatValueDiv('[data-source = cost]')
				const affiliation = formatAffiliation(formatValueDiv('[data-source = affiliation]'))

				return {
					image,
					name,
					model,
					length,
					maxSpeed,
					megalight,
					width,
					height,
					passengers,
					capacity,
					cost,
					affiliation
				}
			})

			console.log({
				link,
				...ship,
			})

			return {
				link,
				...ship,
			}
		})
	)

	await browser.close()

	let data = JSON.stringify(starships);
	fs.writeFileSync('starships.json', data);

	return starships
}

run()