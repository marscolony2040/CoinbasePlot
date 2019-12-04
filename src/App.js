import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import OrderBooks from './components/orderbooks.js';
import title from './images/title.png';

import Plot from 'react-plotly.js';

// Note that your (X, Y) grid size (n x n) equals the default axis labels
// of X and Y on your plots

export default class App extends Component {

  constructor() {
    super();

    this.state = { response: {},
                   endpoint: 'ws://localhost:8080',
                 };

    this.renderTabs = this.renderTabs.bind(this);
    this.renderBooks = this.renderBooks.bind(this);
  }


  componentDidMount() {
    const { endpoint } = this.state;

    const socket = new WebSocket(endpoint);
    socket.onmessage = (evt) => {
        this.setState({ response: JSON.parse(evt.data) });
    };

  }


  renderTabs() {
      const { response } = this.state;
      const tabNames = []
      Object.keys(response).map((q, r) => {
          tabNames.push(
              <Tab>{q}</Tab>
          )
      })
      return tabNames
  }

  renderBooks() {
      const fg = 'cyan';
      const bg = 'black'
      const { response } = this.state;
      const tabBooks = []
      var plots = []

      Object.keys(response).map((q, r) => {
          plots = []
          response[q]['plot2D'].map((s, t) => {
              plots.push(
                  <Plot
                    data={[{
                        x: s[0],
                        y: s[1],
                        marker: {
                          color: response[q]['colors2D'][t]
                        },
                        type: 'bar'
                    }]}
                    layout={{
                        width: 400,
                        height: 400,
                        title: {
                            text: response[q]['tickers'][t],
                            font: {
                                color: fg
                            }
                        },
                        paper_bgcolor: bg,
                        plot_bgcolor: bg,
                        xaxis: {
                            title: {
                                text: 'Bid/Ask Price',
                                font: {
                                    color: fg
                                }
                            },
                            tickvals: s[0],
                            ticktext: s[2],
                            tickfont: {
                                color: fg
                            }
                        },
                        yaxis: {
                          title: {
                            text: 'Bid/Ask Price',
                            font: {
                              color: fg
                            }
                          },
                          tickfont: {
                            color: fg
                          }
                        }
                    }}
                  />
              )
          })
          tabBooks.push(
              <TabPanel style={{backgroundColor: bg, foregroundColor: fg}}>
                { plots }
              </TabPanel>
          )
      })
      return tabBooks
  }


  render() {

    const titleStyle = {
      width: '100%',
      height: '20%',
    }

    const tabNames = this.renderTabs()
    const tabItems = this.renderBooks()

    const bg = 'grey'
    const fg = 'cyan'

    return (
        <Fragment>
            <center>
                <img src={title} alt="title" style={titleStyle} />
                <Tabs>
                    <TabList style={{backgroundColor: bg}}>
                        { tabNames }
                    </TabList>
                    { tabItems }
                </Tabs>
            </center>
        </Fragment>
    );
  }
}
