import React, { useState } from "react"
import CardTile from "./CardTile"

const SearchBar = (props) => {
	const [searchCards, setSearchCards] = useState([])
	const [searchString, setSearchString] = useState('')

	const handleChange = (event) => {
		const newSearchString = event.target.value
		setSearchString(newSearchString)
	}

	const handleSubmit = async(event) => {
		event.preventDefault()
		const body = JSON.stringify({
			search_string: searchString
		})
		try {
			const response = await fetch('/api/v1/cards/search', {
				method: "POST",
				credentials: "same-origin",
				body: body,
				headers: {
					"Content-Type": "application.json",
					"Accept": "application/json"
				}
			})
			if(!response.ok) {
				const errorMessage = `${response.status} (${response.statusText})`
				throw new Error(errorMessage)
			}
			const responseBody = await response.json()
			setSearchCards([
				...searchCards,
				responseBody
			])
			
		} catch (error) {
			console.error(`Error in Fetch: ${error.message}`)
		}
	}

	const cardsTiles = searchCards.map((card) => {
		debugger
		return(
			<div>
				<ul>
					<CardTile key={card.uniqueId} card={card} />
				</ul>
			</div>
		)
	})

	return(
		<div>
			<form onSubmit={handleSubmit}>
				<label>Search for a Card</label>
				<input type='text' name='searchString' value={searchString} onChange={handleChange} />
				<input type='submit' value='Submit' />
			</form>
			<div className="deck-grid-container">
				<div className="grid-x grid-margin-x">
					<div className="grid-container cell medium">
						{cardsTiles}
					</div>
				</div>
			</div>
		</div>
	)
}

export default SearchBar