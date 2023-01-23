import React, { useState, useEffect } from "react"

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

	const editDeckName = () => {
		setUserEditing(!userEditing)
	}
	const saveDeckName = async() => {
		await updateDeck(deck.id, deck.name, deck.description, deck.user_id)
		setUserEditing(false)
	}

	const handleNameChange = (event) => {
		const {name, ...restofthedeck} = deck
		setDeck({name: event.target.value, ...restofthedeck})
	}

  return(
    <div>
      <h1>Deck Show Page</h1>
			{!userEditing &&
			<div> 
				<h1>{deck.name}</h1>
				<button onClick={editDeckName}>change name</button>
				</div>
			} 
			{userEditing &&
			<div>
				<input 
					type="text"
					onChange={(event) => {handleNameChange(event)}}
				/>
				<button onClick={saveDeckName}>save name</button>
			</div>
			}
			<p>{deck.description}</p>
    </div>
  )
}

export default DeckShowPage