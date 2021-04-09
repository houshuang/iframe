import React from "react";
import {BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import WordCloud from "./Wordcloud";
import Query from "./Query";
import Chat from "./Chat";
import Spreadsheet from "./Spreadsheet";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/wordcloud">
          <WordCloud />
        </Route>
        <Route path="/query">
          <Query />
        </Route>
        <Route path="/chat">
          <Chat />
        </Route>
        <Route path="/spreadsheet">
          <Spreadsheet />
        </Route>
      </Switch>
    </Router>
  );
}
