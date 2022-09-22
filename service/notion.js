require('dotenv').config()
const { Client } = require('@notionhq/client')

const notion = new Client({
	auth: process.env.NOTION_API_KEY,
});

module.exports = {
	getListPages: async () => {
		const response = await notion.databases.query({
			database_id: process.env.DB_ID_SHIPS,
		});
		console.log(response.results.map(x => x.properties.Name.title[0].plain_text))
		return response.results;
	},

	setShipToNotion: async (ship) => {
		const {
			link,
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
		} = ship;
		try {
			await notion.pages.create({
				parent: {
					database_id: process.env.DB_ID_SHIPS,
				},
				cover: {
					external: {
						url: image
					},
				},
				properties: {
					Name: {
						title: [
							{
								text: {
									content: name || 'nao informado',
								},
							},
						],
					},
					Link: {
						url: link,
					},
					Image: {
						files: [{
							external: {
								url: image
							},
							name: name
						}]
					},
					Model: {
						rich_text: [
							{
								text: {
									content: model || 'nao informado',
								},
							},
						],
					},
					Length: {
						rich_text: [
							{
								text: {
									content: length || 'nao informado',
								},
							},
						],
					},
					'Max Speed': {
						rich_text: [
							{
								text: {
									content: maxSpeed || 'nao informado',
								},
							},
						],
					},
					'Mega Light': {
						rich_text: [
							{
								text: {
									content: megalight || 'nao informado',
								},
							},
						],
					},
					Width: {
						rich_text: [
							{
								text: {
									content: width || 'nao informado',
								},
							},
						],
					},
					Height: {
						rich_text: [
							{
								text: {
									content: height || 'nao informado',
								},
							},
						],
					},
					Passengers: {
						rich_text: [
							{
								text: {
									content: passengers || 'nao informado',
								},
							},
						],
					},
					Capacity: {
						rich_text: [
							{
								text: {
									content: capacity || 'nao informado',
								},
							},
						],
					},
					Cost: {
						rich_text: [
							{
								text: {
									content: cost || 'nao informado',
								},
							},
						],
					},
					Affiliation: {
						multi_select: affiliation && affiliation.length > 0 ? affiliation.map(x => ({ name: x })) : []
					}
				},
			});
		} catch (error) {
			console.log(error)
		}
	}
}