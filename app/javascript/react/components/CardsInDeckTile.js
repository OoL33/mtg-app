import React from "react"

const CardsInDeckTile = (props) => {
	const showCardsInDeck = () => {
		return props.getCardsInDeck.map((card) => (
			<p key={card.id}>
				{card.id}: {card.name}
				<img src={card.image_urls} />
			</p>
		))
	}

	return(
		<div>
			{showCardsInDeck()}
		</div>
	)
}

export default CardsInDeckTile