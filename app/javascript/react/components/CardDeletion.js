import React, { useState } from "react";

const CardDeletion = ({ cardId, deckId, onDeleteSuccess, onDeleteError }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/decks/${deckId}/cards/${cardId}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        throw new Error(errorMessage);
      }

      // Card deletion was successful
      onDeleteSuccess();
    } catch (error) {
      // Handle error
      onDeleteError(error.message);
    }
  };

  return (
    <button className="button" onClick={handleDelete}>
      Delete Card
    </button>
  );
};

export default CardDeletion;
