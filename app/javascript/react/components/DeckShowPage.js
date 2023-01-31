import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import SearchBar from "./SearchBar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faCircleCheck, faTrash } from "@fortawesome/free-solid-svg-icons"

const DeckShowPage = (props) => {
	const history = useHistory()

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
		setDeck({
			...deck,
			[event.currentTarget.name]: event.currentTarget.value,
		})
	}

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
		} catch (error) {
			console.error(`Error in fetch: ${error.message}`)
		}
	}

	const deleteDeckProperties = async() => {
		await deleteDeck(id)
		setUserEditing(false)
		history.go(-3)
	}

  return(
    <div className="callout grid-container form-container">
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
					<div className="small button-group">
						<a className="button" onClick={saveDeckProperties}><FontAwesomeIcon icon={faCircleCheck} /> Save</a>
						<a className="button" onClick={deleteDeckProperties}><FontAwesomeIcon icon={faTrash} /> Delete Deck</a>
					</div>
				</div>
			}
    </div>
  )
}

export default DeckShowPage
