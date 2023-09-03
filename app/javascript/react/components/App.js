import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import IndexPage from "./IndexPage";
import UserDashboard from "./UserDashboard";
import NewDeckForm from "./NewDeckForm";
import DeckShowPage from "./DeckShowPage";
import Cards from "./Cards";

export const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/users/:id" component={UserDashboard} />
        <Route exact path="/decks/new" component={NewDeckForm} />
        <Route exact path="/decks/:id" component={DeckShowPage} />
        <Route exact path="/cards/search" component={Cards} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
