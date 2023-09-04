import React, { useState, useEffect } from "react";
import CardsInDeckTile from "./CardsInDeckTile";
import SearchCardTile from "./SearchCardTile";
import CardDeletion from "./CardDeletion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";

const Cards = (props) => {
  const [getCardsInDeck, setCardsInDeck] = useState([]);
  const [searchCards, setSearchCards] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchCardTiles, setSearchCardTiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const checkCardsInDeck = async () => {
    try {
      const response = await fetch(
        `/api/v1/decks/${props.currentDeckId}/cards`
      );
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        throw new Error(errorMessage);
      }
      const responseBody = await response.json();
      // Add a unique identifier to each card
      const uniqueCardsInDeck = responseBody.cards.map((card, index) => ({
        ...card,
        uniqueId: `${card.id}-${index}`, // Generate a unique ID
      }));
      setCardsInDeck(uniqueCardsInDeck);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  useEffect(() => {
    checkCardsInDeck();
  }, []);

  const handleChange = (event) => {
    const newSearchString = event.target.value;
    setSearchString(newSearchString);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = JSON.stringify({
      search_string: searchString,
    });
    console.log("search FETCH body:", body);
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/api_cards/search", {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        throw new Error(errorMessage);
      }
      const responseBody = await response.json();
      setSearchCards(responseBody);
    } catch (error) {
      console.error(`Error in Fetch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSearchCardTiles(getSearchCardTiles);
  }, [searchCards]);

  const getSearchCardTiles = () => {
    if (searchCards && searchCards.cards) {
      console.log("getSearchCardTiles - searchCards:", searchCards);
      return searchCards.cards.map((card) => {
        return (
          <div key={card.id} onDoubleClick={() => setSelectedCard(card)}>
            <SearchCardTile
              card={card}
              key={card.id}
              addCardToDeck={addCardToDeck}
            />
          </div>
        );
      });
    } else {
      return null; // Return null or a placeholder if searchCards or searchCards.cards is undefined
    }
  };

  const addCardToDeck = async (card) => {
    try {
      const response = await fetch(
        `/api/v1/decks/${props.currentDeckId}/cards`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ card, deck_id: props.currentDeckId }),
        }
      );
      console.log("addCardToDeck FETCH response:", response);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const handleDeleteSuccess = () => {
    setDeleteSuccess(true);
    setDeleteError(null);
  };

  const handleDeleteError = (error) => {
    setDeleteSuccess(false);
    setDeleteError(error);
  };

  return (
    <div className="deck-grid-container">
      <CardsInDeckTile getCardsInDeck={getCardsInDeck} />
      <form onSubmit={handleSubmit}>
        <label>Search for a Card</label>
        <input
          type="text"
          name="searchString"
          value={searchString}
          onChange={handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
      <div className="deck-grid-container">
        <div className="grid-x grid-margin-x">
          <div className="grid-container cell medium">
            {isLoading && (
              <p>
                <FontAwesomeIcon icon={faSpinner} />
                Searching for Cards...
              </p>
            )}
            {searchCardTiles}
            <a className="button" onClick={addCardToDeck}>
              <FontAwesomeIcon icon={faCircleCheck} /> Add Card to Deck
            </a>
          </div>
          {deleteSuccess && <p>Card deleted successfully!</p>}
          {deleteError && <p>Error: {deleteError}</p>}
          <CardDeletion
            cardId={selectedCard?.id}
            deckId={props.currentDeckId}
            onDeleteSuccess={handleDeleteSuccess}
            onDeleteError={handleDeleteError}
          />
        </div>
      </div>
    </div>
  );
};

export default Cards;
