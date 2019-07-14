import React from "react";
import Player from "./player/Player";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="app-container">
        <Player />
      </div>
    );
  }
}

export default App;