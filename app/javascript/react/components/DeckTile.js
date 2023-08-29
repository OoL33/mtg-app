import React from "react";
import card_game from "../../../assets/images/noun-magic-cards.svg";

const DeckTile = (props) => {
  return (
    <div className="deck_tile">
      <div
        className="grid-x grid-margin-x"
        data-equalizer
        data-equalize-on="medium"
        id="test-eq"
      >
        <div className="cell medium-4">
          <h3>{props.deck.name}</h3>
          <div className="callout" data-equalizer-watch>
            <img src={card_game} alt="blank playing card"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckTile;
