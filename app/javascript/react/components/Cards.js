import React, { useState, useEffect } from "react"
import CardsInDeckTile from "./CardsInDeckTile"
import SearchCardTile from "./SearchCardTile"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

const Cards = (props) => {
	const [getCardsInDeck, setCardsInDeck] = useState([])
	const [searchCards, setSearchCards] = useState([])
	const [searchString, setSearchString] = useState('')
	const [searchCardTiles, setSearchCardTiles] = useState(null)

	const checkCardsInDeck = async() => {
		try {
			const response = await fetch(`/api/v1/decks/${props.currentDeckId}/cards`)
			if(!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
      const responseBody = await response.json()
			console.log("checkCardsInDeck responseBody:")
			console.log(responseBody.cards)
			setCardsInDeck(responseBody.cards)
		} catch (error) {
			console.error(`Error in fetch: ${error.message}`)
		}
	}

	useEffect(() => {
		checkCardsInDeck()
	}, [])

	const handleChange = (event) => {
		const newSearchString = event.target.value
		setSearchString(newSearchString)
	}

	const dedupedCards = (data) => {
		console.log(data)
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
		console.log('search FETCH body:', body)
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
			console.log("handleSubmit responseBody:")
			console.log(responseBody)
			const dedupedArray = dedupedData(responseBody)
			setSearchCards(dedupedArray)
		} catch (error) {
			console.error(`Error in Fetch: ${error.message}`)
		}
	}

	useEffect(() => {
		setSearchCardTiles(getSearchCardTiles)
	}, [searchCardTiles])

	const getSearchCardTiles = () => {
		return searchCards.map((card) => {
			return(
				<div key={card.id}>
					<SearchCardTile card={card} key={card.id} />
				</div>
			)
		})
	}

	const addCardToDeck = async() => {
		try {
			const response = await fetch(`/api/v1/cards`, {
				method: "POST",
				credentials: "same-origin",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: searchCardTiles[0].key, deck_id: props.currentDeckId })
			})
			console.log('addCardToDeck FETCH response:' ,response)
		} catch (error) {
			console.error(`Error in fetch: ${error.message}`)
		}
	}

	return(
		<div>
			<CardsInDeckTile
				getCardsInDeck={getCardsInDeck}
			/>
			<a className="button" onClick={addCardToDeck}><FontAwesomeIcon icon={faCircleCheck} /> Add Card to Deck</a>
			<form onSubmit={handleSubmit}>
				<label>Search for a Card</label>
				<input type='text' name='searchString' value={searchString} onChange={handleChange} />
				<input type='submit' value='Submit' />
			</form>
			<div className="deck-grid-container">
				<div className="grid-x grid-margin-x">
					<div className="grid-container cell medium">
						{searchCardTiles}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Cards