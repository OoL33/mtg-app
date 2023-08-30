import React from "react";
import { Link } from "react-router-dom";

const CreateNewDeckContainer = () => {
  return (
    <div id="create-new-deck">
      <div className="callout small">
        <Link to="/decks/new" className="link">
          Create a New Deck
        </Link>
      </div>
    </div>
  );
};

export default CreateNewDeckContainer;
