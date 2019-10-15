import React, { Component, Fragment } from 'react';
import OrderBooks from './components/orderbooks.js';
import title from './images/title.png';

// Note that your (X, Y) grid size (n x n) equals the default axis labels
// of X and Y on your plots

export default class App extends Component {

  constructor() {
    super();

    this.state = { response: null,
                   endpoint: 'ws://localhost:8080',
                   tickers: [],
                   plot2D: [],
                   colors2D: [],
                 };
  }

  componentDidMount() {
    const { endpoint } = this.state;

    const socket = new WebSocket(endpoint);
    socket.onmessage = evt => {
      const result = JSON.parse(evt.data)
      this.setState({ plot2D: result['plot2D'],
                      colors2D: result['colors2D'],
                      tickers: result['tickers']
                      });
    }

  }

  render() {

    const titleStyle = {
      width: '100%',
      height: '60%',
    }

    return (
      <Fragment>
        <center>
          <img src={title} alt="title" style={titleStyle} />
          <OrderBooks state={this.state} />
        </center>
      </Fragment>
    );
  }
}
