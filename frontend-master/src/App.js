import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import TempPage from './tempVis';
import ComboVis from './comboVis';
import './App.css';


class App extends Component {

  render() {
    return (
		  <div>
        <h1>Data Visualization Using Yelp Dataset</h1>
        <div className="Center">
          <Link className="Link" to="/temp">Temporal Visualization</Link>
          <Link className="Link" to="/multi">Multiple Visualizations</Link>
        </div>

        <div className="App">
          <Route path="/temp" component={TempPage} />
          <Route path="/multi" component={ComboVis} />
        </div>
      </div>
    )
  }
}

export default App;
