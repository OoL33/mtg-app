import React from "react";
import card_game from "../../../assets/images/noun-magic-cards.svg";

const DeckTile = (props) => {
  return (
    <div className="cell">
      <div className="card callout">
        <div className="card-section">
          <h3 className="deck-title">{props.deck.name}</h3>
        </div>
        <div className="card-section"></div>
        <img src={card_game} alt="blank playing card"></img>
      </div>
    </div>
  );
};

export default DeckTile;
