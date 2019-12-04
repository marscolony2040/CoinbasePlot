import React, { Component, Fragment } from 'react';
import Plot from 'react-plotly.js';


export default class OrderBooks extends Component {

  plotLayout(width, height) {
     
    const { tickers, colors2D, plot2D } = this.props.state;
    const code = [];

    const fg_color = 'cyan';
    const bg_color = 'black'

    for(var i = 0; i < tickers.length; i++){
      code.push(<Plot
                    data={[{
                      x: plot2D[i][0],
                      y: plot2D[i][1],
                      marker: {
                        color: colors2D[i]
                      },
                      type: 'bar'
                    }]}
                    layout={{
                      width: width,
                      height: height,
                      title: {
                        text: tickers[i],
                        font: {
                          color: fg_color
                        }
                      },
                      paper_bgcolor: bg_color,
                      plot_bgcolor: bg_color,
                      xaxis: {
                        title: {
                          text: 'Bid/Ask Price',
                          font: {
                            color: fg_color
                          }
                        },
                        tickvals: plot2D[i][0],
                        ticktext: plot2D[i][2],
                        tickfont: {
                          color: fg_color
                        }
                      },
                      yaxis: {
                        title: {
                          text: 'Bid/Ask Price',
                          font: {
                            color: fg_color
                          }
                        },
                        tickfont: {
                          color: fg_color
                        }
                      }
                    }}
                />);
    }

    return code;
  }


  render() {

    const plotboard = this.plotLayout(400, 400);

    return (
      <Fragment>
        {plotboard}
      </Fragment>
    );

  }

}
