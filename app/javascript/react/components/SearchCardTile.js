import React, { useState, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

const SearchCardTile = (props) => {
  debugger
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const addCardButtonRef = useRef(null)

	const handleDoubleClick = async () => {
    await props.addCardToDeck(props.card)
		setShowSuccessMessage(true)
    if (addCardButtonRef.current) {
      addCardButtonRef.current.click()
    }
	}

  const handleSuccessMessageClose = () => {
    setShowSuccessMessage(false)
  }

	return(
	<div>
		<div className="grid-x grid-margin-x" data-equalizer data-equalize-on="medium" id="test-eq">
			<div className="cell medium-4">
				<div className="callout" data-equalizer-watch onDoubleClick={handleDoubleClick}>
				{props.card.name}
				<img src={props.card.image_urls} />
        <a className="button" ref={addCardButtonRef}>
          <FontAwesomeIcon icon={faCircleCheck} /> Add Card to Deck</a>
				</div>
			</div>
		</div>
    {showSuccessMessage && (
      <div className="success-message">
        Card added to Deck!
        <button onClick={handleSuccessMessageClose}>Close</button>
      </div>
    )}
	</div>
	)
}

export default SearchCardTile