# CoinbasePro Live Orderbook Plotter

## Demo :tv:

![Alt](https://github.com/MoSharieff/CoinbasePlot/blob/master/pics/demo2.gif)

## Description :pencil:
A WebApp, developed using Python3 and React.js, which displays live orderbook visualizations for all crypto-currency pairs trading on Coinbase Pro.

The plot is green whenever the volume on the Bid book is greater than the Ask book, and the plot is red whenever the volume on the Ask book is greater than the Bid book.

## Installation :alarm_clock:

I have included an ```install.py``` file which may be used for a full installation. If you prefer the manual way you may simply type 

```sh
> pip3 install aiohttp websockets numpy pandas
```

To install the javascript libraries, you may simply run ``` npm install ``` (dependencies are included in package.json). 

## Running :battery:

Note I developed this using Python3.7 but Python3 should also work (works on my other computer). You can set this to run on default in your "scripts" section in your package.json file under "dev".

```sh
> python3.7 server & npm start
```

