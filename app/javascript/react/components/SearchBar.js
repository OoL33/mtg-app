import React, { useState, useEffect } from "react"
import CardTile from "./CardTile"

const SearchBar = (props) => {
	const [searchCards, setSearchCards] = useState([])
	const [searchString, setSearchString] = useState('')
	const [cardTiles, setCardTiles] = useState(null)

	const handleChange = (event) => {
		const newSearchString = event.target.value
		setSearchString(newSearchString)
	}

	const dedupedData = (data) => {
		return data.filter((item, index, self) => 
  		index === self.findIndex((t) => (
    	t.name === item.name
  		))
		)
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
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})
			if(!response.ok) {
				const errorMessage = `${response.status} (${response.statusText})`
				throw new Error(errorMessage)
			}
			const responseBody = await response.json()
			const dedupedArray = dedupedData(responseBody.cards)
			setSearchCards(dedupedArray)
		} catch (error) {
			console.error(`Error in Fetch: ${error.message}`)
		}
	}
4
	useEffect( () => {
		setCardTiles(getCardTiles())
	}, [searchCards])


	const getCardTiles = () => {
		return searchCards.map((card) => {
			return(
				<div key={card.id}>
					<CardTile card={card} key={card.id} />
				</div>
			)
		})
	}

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
						{cardTiles}
					</div>
				</div>
			</div>
		</div>
	)
}

export default SearchBar