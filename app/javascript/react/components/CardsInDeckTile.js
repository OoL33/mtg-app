import React from "react";

const CardsInDeckTile = (props) => {
  const showCardsInDeck = () => {
    return props.getCardsInDeck.map((card) => (
      <div key={card.uniqueId}>
        <p>
          {card.id}: {card.name}
          <img src={card.image_urls} alt={card.name} />
        </p>
      </div>
    ));
  };

  return <div>{showCardsInDeck()}</div>;
};

export default CardsInDeckTile;
