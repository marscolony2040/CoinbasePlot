# CoinbasePro Live Orderbook Plotter

## Description :pencil:
A WebApp, developed using Python3 and React.js, which displays USD and BTC pair currencies live orderbook visualizations from Coinbase Pro.

## Installation :alarm_clock:

I have included an ```install.py``` file which may be used for a full installation. If you prefer the manual way you may simply type 

```sh
> pip3 install aiohttp websockets numpy pandas

or 

> ./install.sh
```

To install the javascript libraries, you may simply run ``` npm install ``` (dependencies are included in package.json). 

## Running :battery:

Note I developed this using Python3.7 but Python3 should also work (works on my other computer). You can set this to run on default in your "scripts" section in your package.json file under "dev".

```sh
> python3.7 server & npm start
```

## Demo :tv:

![Alt](https://github.com/MoSharieff/CoinbasePlot/blob/master/pics/demo.gif)


## Libraries Used :telephone:
Python
> asyncio<br/>
> aiohttp<br/>
> numpy<br/>
> pandas <br/>
> websockets<br/>

React.js
> Plotly.js/React-Plotly.js
