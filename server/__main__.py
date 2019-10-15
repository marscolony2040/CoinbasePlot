import asyncio
import websockets
import time

from home import MarketData

mkt = MarketData()

async def start(ws, path):
    await mkt.start(ws)

def server():
    print('Starting up Back-End w/ Python3')
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(websockets.serve(start, 'localhost', 8080))
    loop.run_forever()

server()
