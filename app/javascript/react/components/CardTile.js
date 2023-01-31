import React from "react"

const CardTile = (props) => {
	return(
	<div>
		<div className="grid-x grid-margin-x" data-equalizer data-equalize-on="medium" id="test-eq">
			<div className="cell medium-4">
				<div className="callout" data-equalizer-watch>
				{props.cards.name}
				</div>
			</div>
		</div>
	</div>
	)
}

export default CardTile