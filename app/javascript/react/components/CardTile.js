import React from "react"

const CardTile = (props) => {
	return(
	<div>
		<div className="grid-x grid-margin-x" data-equalizer data-equalize-on="medium" id="test-eq">
			<div className="cell medium-4">
				<div className="callout" data-equalizer-watch>
				{props.card.name}
				<img src={props.card.image_urls} />
				</div>
			</div>
		</div>
	</div>
	)
}

export default CardTile