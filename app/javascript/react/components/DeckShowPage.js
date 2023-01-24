import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"

const DeckShowPage = (props) => {
	const [deck, setDeck] = useState({
		id: undefined,
		name: "",
		description: "",
		user_id: undefined 
	})

	const fetchDeck = async() => {
		try {
			const deckId = props.match.params.id
      const response = await fetch(`/api/v1/decks/${deckId}`)
      if(!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
      const responseBody = await response.json()
			const singleDeckData = responseBody.deck
      setDeck(singleDeckData) 
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
	}

	useEffect(() => {
		fetchDeck()
	}, [])

	const [userEditing, setUserEditing] = useState(false)

	const updateDeck = async(id, name, description, user_id) => {
		const newObject = {id: id, name: name, description: description, user_id: user_id}
		try {
			const deckId = props.match.params.id
			const response = await fetch(`/api/v1/decks/${deckId}`, {
				method: "PUT",
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
			const singleDeckData = responseBody.deck
			setDeck(singleDeckData)
		} catch (error) {
			console.error(`Error in fetch: ${error.message}`)
		}
	}

	const editDeckProperties = () => {
		setUserEditing(!userEditing)
	}
	const saveDeckProperties = async() => {
		await updateDeck(deck.id, deck.name, deck.description, deck.user_id)
		setUserEditing(false)
	}

	const handleNameChange = (event) => {
		/*const {name, ...restofthedeck} = deck
		setDeck({name: event.target.value, ...restofthedeck}) */
		setDeck({
			...deck,
			[event.currentTarget.name]: event.currentTarget.value,
		})
	}

	const [userDeletingDeck, setUserDeleteDeck] = useState(false)

	const deleteDeck = async(id) => {
		try {
			const deckId = props.match.params.id
			const response = await fetch(`/api/v1/decks/${deckId}`, {
				method: "DELETE",
				credentials: "same-origin",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			})
			if(!response.ok) {
				const errorMessage = `${response.status} (${response.statusText})`
				throw new Error(errorMessage)
			}
			//const responseBody = await response.json()
			navigate('/users/:id')
			//const selectedDeck = responseBody.deck
			//setUserDecks(selectedDeck)
		} catch (error) {
			console.error(`Error in fetch: ${error.message}`)
		}
	}

	const selectDeckToDelete = () => {
		setUserDeleteDeck(userDeletingDeck)
	}

  return(
    <div>
      <h1>Deck Show Page</h1>
			{!userEditing &&
				<div> 
					<h1>{deck.name}</h1>
					<p>{deck.description}</p>
					<FontAwesomeIcon icon={faPenToSquare} /><button onClick={editDeckProperties}>Edit Deck</button>
				</div>
			} 
			{userEditing &&
				<div>
					<input 
						name="name"
						id="name"
						type="text"
						placeholder="Deck Name"
						value={deck.name}
						onChange={(event) => {handleNameChange(event)}}
					/>
					<input
						name="description"
						id="id" 
						type="text"
						placeholder="Deck Description"
						value={deck.description}
						onChange={(event) => {handleNameChange(event)}}
					/>
					<button onClick={saveDeckProperties}>Save</button>
					{userDeletingDeck &&
						<div>
							<FontAwesomeIcon icon={faTrash} /><button onClick={selectDeckToDelete}>Delete Deck</button>
						</div>
					}
				</div>
			}
    </div>
  )
}

export default DeckShowPage