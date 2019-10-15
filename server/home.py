import time
import datetime
import json
import numpy as np
import pandas as pd

import aiohttp

import asyncio


class DataManager:

    bids = {}
    asks = {}

    depth = 8

    async def now(self):
        return datetime.datetime.fromtimestamp(int(time.time())).strftime('%m-%d-%Y %H:%M:%S')

    async def prepare2D(self, tickers):
        tickers = list(sorted(tickers))
        ticks, data, colors = [], [], []
        for t in tickers:
            if t in self.bids.keys() and t in self.asks.keys():
                b0, a0 = list(sorted(self.bids[t].keys(), reverse=True)), list(sorted(self.asks[t].keys()))
                b0, a0 = list(reversed(b0[:self.depth])), a0[:self.depth]
                b1, a1 = [self.bids[t][b] for b in b0], [self.asks[t][a] for a in a0]

                tx = b0 + a0
                x = [i + 1 for i in range(len(tx))]
                volB, volA = [np.sum([v for p, v in zip(b0[v:], b1[v:])]) for v in range(len(b0))], [np.sum([v for p, v in zip(a0[:v+1], a1[:v+1])]) for v in range(len(a0))]
                y = volB + volA
                ticks.append(t)
                data.append([x, y, ['{0:.2f}'.format(yonkers) if 'USD' in t or 'EUR' in t or 'GBP' in t else '{0:.8f}'.format(yonkers) for yonkers in tx]])
                colors.append('limegreen' if np.sum(volB) > np.sum(volA) else 'red')
        return {'tickers': ticks, 'plot2D': data, 'colors2D': colors}

    async def load_tickers(self, resp):
        head = resp[0].keys()
        data = [[v[h] for h in head] for v in resp]
        frame = pd.DataFrame(data=data, columns=head)
        return frame

    async def place_books(self, resp):
        ticker = resp['product_id']
        fl = lambda x: [[float(j) for j in i] for i in x]
        #self.bids[ticker] = pd.DataFrame(data=fl(resp['bids']), columns=['Price', 'Volume'])
        #self.asks[ticker] = pd.DataFrame(data=fl(resp['asks']), columns=['Price','Volume'])

        self.bids[ticker] = {float(i[0]):float(i[1]) for i in resp['bids']}
        self.asks[ticker] = {float(i[0]):float(i[1]) for i in resp['asks']}



    async def change_books(self, resp):
        try:
            ticker = resp['product_id']
            for (side, price, volume) in resp['changes']:
                price, volume = float(price), float(volume)
                if side == 'buy':
                    if volume <= 0:
                        if price in self.bids[ticker].keys():
                            del self.bids[ticker][price]
                    else:
                        self.bids[ticker][price] = volume

                else:
                    if volume <= 0:
                        if price in self.asks[ticker].keys():
                            del self.asks[ticker][price]
                    else:
                        self.asks[ticker][price] = volume

        except:
            pass


class REST(DataManager):

    async def get_tickers(self, sess):
        method = "/products"
        async with sess.get(self.url + method) as resp:
            resp = json.loads(await resp.text())
            return await self.load_tickers(resp)


class MarketData(REST):

    def __init__(self):
        self.url = "https://api.pro.coinbase.com"
        self.ws_url = "wss://ws-feed.pro.coinbase.com"
        self.sync = False

    async def start(self, ws):
        async with aiohttp.ClientSession() as sess:
            tickers = await self.get_tickers(sess)
            ticks = [str(i).replace(' ', '') for i in tickers['id'].values if 'USD' == i.split('-')[1] or 'BTC' == i.split('-')[1]]
            await asyncio.wait([asyncio.ensure_future(self.coinbase_client(sess, ticks)),
                                asyncio.ensure_future(self.coinbase_server(ws, ticks))])

    async def coinbase_server(self, ws, ticks):
        await asyncio.sleep(3)
        print('Sending Data')
        while True:
            msg = await self.prepare2D(ticks)
            print('Sending Message Length: {}'.format(len(msg)))
            await ws.send(json.dumps(msg))
            await asyncio.sleep(1.5)

    async def coinbase_client(self, sess, ticks):
        async with sess.ws_connect(self.ws_url) as wss:
            msg = {"type": "subscribe",
                   "product_ids": ticks,
                   "channels": ["level2"]
                   }
            await wss.send_str(json.dumps(msg))

            while True:
                res = await wss.receive()
                res = json.loads(res.data)

                if 'type' in res.keys():
                    if res['type'] == 'snapshot':
                        await self.place_books(res)
                    elif res['type'] == 'l2update':
                        await self.change_books(res)
                    else:
                        pass
