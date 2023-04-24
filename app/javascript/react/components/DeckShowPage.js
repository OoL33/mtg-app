import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faCircleCheck, faTrash } from "@fortawesome/free-solid-svg-icons"
import Cards from "./Cards"

const DeckShowPage = (props) => {
	const history = useHistory()

	const [deck, setDeck] = useState({
    id: '',
    name: '',
    description: '',
    user_id: ''
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
      setDeck({
        id: singleDeckData.id,
        name: singleDeckData.name,
        description: singleDeckData.description,
        user_id: singleDeckData.user_id,
      })
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
	}

	useEffect(() => {
		fetchDeck()
	}, [])

	const [userEditing, setUserEditing] = useState(false)

	const updateDeck = async() => {
		try {
			const deckId = props.match.params.id
			const response = await fetch(`/api/v1/decks/${deckId}`, {
				method: "PUT",
				credentials: "same-origin",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ decks: deck })
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

	const deleteDeck = async() => {
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
		await deleteDeck()
		setUserEditing(false)
		history.go(-4)
	}

  return(
    <div className="callout grid-container form-container">
			{!userEditing &&
				<div> 
					<h1>{deck.name}</h1>
					<p>{deck.description}</p>
					<FontAwesomeIcon icon={faPenToSquare} /><button onClick={editDeckProperties}> Edit Deck</button>
					<Cards
						currentDeck={deck}
						currentDeckId={props.match.params.id}
					/>					
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
