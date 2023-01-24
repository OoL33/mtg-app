import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DeckTile from "./DeckTile"

const UserDashboard = (props) => {

	const [currentUserIdFromServer, setCurrentUserIdFromServer] = useState()

	const [currentUserIdFromUrl, setCurrentUserIdFromUrl] = useState()

  const [getUserDecks, setUserDecks] = useState([])

	const [renderError, setRenderError] = useState(false)

	const fetchUserDecks = async() => {
		try {
			const response = await fetch(`/api/v1/users/current`)
			if (!response.ok) {
				const errorMessage = `${response.status} (${response.statusText})`
				throw new Error(errorMessage)
			}

			const responseBody = await response.json()
			const currentDecks = responseBody.user.decks
			setCurrentUserIdFromServer(responseBody.user.id)
			
			setUserDecks(currentDecks)
		} catch (error) {
			console.error(`Error in Fetch: ${error.message}`)
		}
	}

	useEffect( () => {
		fetchUserDecks()
	}, [])

	useEffect( ()=> {
		setCurrentUserIdFromUrl(props.match.params.id)
	}, [])

	useEffect( () => {
		validateValidUserPath()
	}, [currentUserIdFromServer, currentUserIdFromUrl])


	const validateValidUserPath = () => {
		if (currentUserIdFromUrl && currentUserIdFromServer) {
			const isValidUserInPath = currentUserIdFromServer.toString() === currentUserIdFromUrl
			isValidUserInPath ? setRenderError(false) : setRenderError(true)
		} 
	}

	const deckTiles = getUserDecks.map((deck) => {
		return(
			<Link to={`/decks/${deck.id}`} key={deck.id}>
				<DeckTile key={deck.id} deck={deck} />
			</Link>
		)
	})

	const deleteDeck = async(id, name, description, user_id) => {
		const newObject = {id: id, name: name, description: description, user_id: user_id}
		try {
			const deckId = props.match.params.id
			const response = await fetch(`/api/v1/decks/${deckId}`, {
				method: "DELETE",
				credentials: "same-origin",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ decks: newObject })
			})
			if(!response.ok) {
				const errorMessage = `${response.status} (${response.statusText})`
				throw new Error(errorMessage)
			}
			const responseBody = await response.json()
			const selectedDeck = responseBody.deck
			setUserDecks(selectedDeck)
		} catch (error) {
			console.error(`Error in fetch: ${error.message}`)
		}
	}

	const saveDeletedDecks = async() => {
		await deleteDeck(deck.id, deck.name, deck.description, deck.user_id)
		setUserDeleteDecks(false)
	}

  return(
    <div className="grid-container">
		{renderError && 
			<span> User in path does not match with the user signed in </span>
		}
		{!renderError &&
			<div>
				<h1>Welcome!</h1>
				<div className="create-new-deck">
					<h2><Link to="/decks/new">Create a New Deck</Link></h2>
				</div>					
				<div className="deck-grid-container">
					<div className="grid-x grid-margin-x">
						<div className="grid-container cell medium">
							{deckTiles}
						</div>
					</div>
				</div>
			</div>
		}	
    </div>
  )
}

export default UserDashboard
