import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import UserDashboard from './UserDashboard'
import NewDeckForm from './NewDeckForm'
import DeckShowPage from './DeckShowPage'
import IndexPage from './IndexPage'

export const App = (props) => {
  return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={IndexPage} />
				<Route exact path="/users/:id" component={UserDashboard} />
				<Route exact path="/decks/new" component={NewDeckForm}/>
				<Route exact path="/decks/:id" component={DeckShowPage} />
			</Switch>
		</BrowserRouter>
	)
}

export default App
