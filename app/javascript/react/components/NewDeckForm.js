import React, { useState } from "react"
import { Redirect } from "react-router-dom"

const NewDeckForm = (props) => {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [newDeck, setNewDeck] = useState({
    name: "",
    description: ""
  })

  const handleInputChange = (event) => {
    setNewDeck({
      ...newDeck,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }

  const postNewDeck = async(event) => {
    event.preventDefault()

    try {
      const userId = props.match.params.id
      const response = await fetch(`/api/v1/users/${userId}/decks`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
					'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deck: newDeck })
      })
      if(!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
      const responseBody = await response.json()
      setNewDeck(responseBody.deck)
      setShouldRedirect(true)
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  if (shouldRedirect) {
    return <Redirect to='/'/>
  }

  return(
    <form onSubmit={postNewDeck}>
      <label>
        Deck Name:
        <input 
          name="name"
          type="text"
          id="name"
          value={newDeck.name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Deck Description:
        <input 
          name="description"
          type="text"
          id="description"
          value={newDeck.description}
          onChange={handleInputChange}
        />
      </label>
      <button className="submit">
        <input 
          className="button"
          type="submit"
					/>
      </button>
    </form>
  )
}

export default NewDeckForm
