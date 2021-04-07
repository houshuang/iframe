import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import WordCloud from "./Wordcloud";
import Query from "./Query";
import Chat from "./Chat";
import Diagram from "./Diagram";

export default function App() {
  console.log("APP");
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
        <Route path="/diagram">
          <Diagram />
        </Route>
      </Switch>
    </Router>
  );
}
