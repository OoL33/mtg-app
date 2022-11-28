import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DeckTile from "./DeckTile"

const UserDashboard = (props) => {
  const [getUserDecks, setUserDecks] = useState([])

  const fetchUserDecks = async() => {
    try {
			//const userId = props.match.params.id 
			debugger
      const response = await fetch(`/api/v1/users/${props.match.params.id}/decks`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
      const responseBody = await response.json()
			const decksData = responseBody.decks
      setUserDecks(decksData)
    } catch (error) {
      console.error(`Error in Fetch: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchUserDecks()
  }, [])

	const deckTiles = getUserDecks.map((deck) => {
		return(
			<Link to={`/decks/${deck.id}`} key={deck.id}>
				<DeckTile deck={deck} />
			</Link>
		)
	})

  return(
    <div className="grid-container">
      <h1>Welcome!</h1>
        <div className="createNewDeck">
          <Link to="/decks/new">Create a New Deck</Link>
					<div className="grid-container">
						{deckTiles}
					</div>
        </div>
    </div>
  )
}

export default UserDashboard
