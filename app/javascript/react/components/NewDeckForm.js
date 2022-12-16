import React, { useState } from "react"
import ErrorList from "./ErrorList"
import _ from "lodash"
import { Redirect } from "react-router-dom"

const NewDeckForm = (props) => {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [newDeck, setNewDeck] = useState({
    name: "",
    description: ""
  })
	const [errors, setErrors] = useState({})

  const handleInputChange = (event) => {
    setNewDeck({
      ...newDeck,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }

	const validForSubmission = () => {
		let submitErrors = {}
		const requiredFields = ["name", "description"]
		requiredFields.forEach(field => {
			if (newDeck[field].trim() === "") {
				submitErrors = {
					...submitErrors,
					[field]: "is blank"
				}
			}
		})
		setErrors(submitErrors)
		return _.isEmpty(submitErrors)
	}

  const postNewDeck = async(event) => {
		event.preventDefault()

		if (validForSubmission()) {
			try {
      	//const userId = props.match.params.id
				const response = await fetch(`/api/v1/decks`, {
					method: "POST",
					credentials: "same-origin",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ decks: newDeck })
				})
				if(!response.ok) {
					const errorMessage = `${response.status} (${response.statusText})`
					throw new Error(errorMessage)
				}
				const responseBody = await response.json()
				if (responseBody.errors) {

					setErrors(responseBody.errors)
				} else {
					setShouldRedirect(true)
				}
			} catch (error) {
				console.error(`Error in fetch: ${error.message}`)
			}
		}
	}



  if (shouldRedirect) {
    return <Redirect to={`/users/${props.match.params.id}`} />
  }

  return(
		<div className="new-deck grid-container form-container">
    <form onSubmit={postNewDeck}>
			<ErrorList errors={errors}/>
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
		</div>
  )
}

export default NewDeckForm
