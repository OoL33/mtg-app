import React from "react";
import { Link } from "react-router-dom";

const CreateNewDeckContainer = () => {
  return (
    <div className="button callout">
      <Link to="/decks/new" className="link">
        <h1>Create a New Deck</h1>
      </Link>
    </div>
  );
};

export default CreateNewDeckContainer;
