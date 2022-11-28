import React, { useState, useEffect } from "react"

const DeckShowPage = (props) => {
	const [deck, setDeck] = useState([])

	const fetchDecks = async() => {
		try {
      //const id = props.match.params.id
			const deckId = props.match.params.id
			debugger
      const response = await fetch(`/api/v1/decks/${deckId}`)
      if(!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
      const responseBody = await response.json()
			debugger
			const singleDeckData = responseBody.decks
			debugger
      setDeck(singleDeckData) 
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
	}

	useEffect(() => {
		fetchDecks()
	}, [])

  return(
    <div>
      <h1>Deck Show Page</h1>
			<h1>{deck.name}</h1>
			<p>{deck.description}</p>
    </div>
  )
}

export default DeckShowPage