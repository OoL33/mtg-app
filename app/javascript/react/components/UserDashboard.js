import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeckTile from "./DeckTile";
import CreateNewDeckContainer from "./CreateNewDeckContainer";

const UserDashboard = (props) => {
  const [currentUserIdFromServer, setCurrentUserIdFromServer] = useState();

  const [currentUserIdFromUrl, setCurrentUserIdFromUrl] = useState();

  const [getUserDecks, setUserDecks] = useState([]);

  const [renderError, setRenderError] = useState(false);

  const fetchUserDecks = async () => {
    try {
      const response = await fetch(`/api/v1/users/current`);
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        throw new Error(errorMessage);
      }

      const responseBody = await response.json();
      const currentDecks = responseBody.user.decks;
      setCurrentUserIdFromServer(responseBody.user.id);
      setUserDecks(currentDecks);
    } catch (error) {
      console.error(`Error in Fetch: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserDecks();
  }, []);

  useEffect(() => {
    setCurrentUserIdFromUrl(props.match.params.id);
  }, []);

  useEffect(() => {
    validateValidUserPath();
  }, [currentUserIdFromServer, currentUserIdFromUrl]);

  const validateValidUserPath = () => {
    if (currentUserIdFromUrl && currentUserIdFromServer) {
      const isValidUserInPath =
        currentUserIdFromServer.toString() === currentUserIdFromUrl;
      isValidUserInPath ? setRenderError(false) : setRenderError(true);
    }
  };

  const deckTiles = getUserDecks.map((deck) => {
    return (
      <Link to={`/decks/${deck.id}`} key={deck.id}>
        <DeckTile key={deck.id} deck={deck} />
      </Link>
    );
  });

  return (
    <div className="grid-container">
      {renderError && (
        <span> User in path does not match with the user signed in </span>
      )}
      {!renderError && (
        <div>
          <h1>Welcome!</h1>
          <div className="create-new-deck">
            <h2>
              <CreateNewDeckContainer />
            </h2>
          </div>
          <div className="deck-grid-container">
            <div className="grid-x grid-margin-x">
              <div className="grid-container cell medium">{deckTiles}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
