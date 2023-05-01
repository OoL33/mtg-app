import React from "react"

const CardsInDeckTile = (props) => {
  
	const showCardsInDeck = () => {
    if (!props.cardsInDeck || props.cardsInDeck.length === 0) {
      return <p>No cards in deck.</p>
    }
		return props.cardsInDeck.map((card) => (
			<p key={card.id}>
				{card.id}: {card.name}
				<img src={card.image_urls} onDoubleClick={() => handleCardDoubleClick(card)} />
			</p>
		))
	}

  const handleCardDoubleClick = (card) => {
    const confirmed = window.confirm("Do you want to delete this card from the deck?")
    if (confirmed) {
      props.removeCardFromDeck(card)
    }
  }

	return(
		<div>
			{showCardsInDeck()}
		</div>
	)
}

export default CardsInDeckTile