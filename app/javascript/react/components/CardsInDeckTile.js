import React from "react";

const CardsInDeckTile = (props) => {
  const showCardsInDeck = () => {
    return (
      <div className="grid-x">
        {props.getCardsInDeck.map((card) => (
          <div
            className="card-tile cell small-6 medium-4 large-4"
            key={card.uniqueId}
          >
            <img src={card.image_urls} alt={card.name} />
          </div>
        ))}
      </div>
    );
  };

  return <div>{showCardsInDeck()}</div>;
};

export default CardsInDeckTile;
