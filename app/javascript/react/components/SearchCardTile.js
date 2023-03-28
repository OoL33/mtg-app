import React from "react"

const SearchCardTile = (props) => {
	const { card, addCardToDeck } = props 

	const handleDoubleClick = () => {
		addCardToDeck(card)
	}

	return(
	<div>
		<div className="grid-x grid-margin-x" data-equalizer data-equalize-on="medium" id="test-eq">
			<div className="cell medium-4">
				<div className="callout" data-equalizer-watch onDoubleClick={handleDoubleClick}>
				{props.card.name}
				<img src={props.card.image_urls} />
				</div>
			</div>
		</div>
	</div>
	)
}

export default SearchCardTile