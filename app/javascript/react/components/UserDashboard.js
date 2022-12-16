import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DeckTile from "./DeckTile"
import NewDeckForm from "./NewDeckForm"

const UserDashboard = () => {
  const [getUserDecks, setUserDecks] = useState([])

  const fetchUserDecks = async() => {
    try {
      const response = await fetch(`/api/v1/users/current`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
      const responseBody = await response.json()
			const currentDecks = responseBody.user.decks
      setUserDecks(currentDecks)
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
				<DeckTile key={deck.id} deck={deck} />
			</Link>
		)
	})
/*
	const newDeckSubmitHandler = (deck) => {
		setUserDecks([...getUserDecks, deck])
	}
*/
  return(
    <div className="grid-container">
      <h1>Welcome!</h1>
        <div className="create-new-deck">
          <h2><Link to="/decks/new">Create a New Deck</Link></h2>
				</div>					
				<div className="deck-grid-container">
					<div className="grid-x grid-margin-y">
						<div className="grid-container cell medium">
							{deckTiles}
						</div>
					</div>
				</div>
    </div>
  )
}

export default UserDashboard
