import 'global-agent/bootstrap';
import { FullTrader } from './trader/full_trader';
import { CreateBinanceFuturesLong } from './exchange/binance/futures_long';
import { CreateBinanceFuturesShort } from './exchange/binance/futures_short';
import { CreateBinanceSpot } from './exchange/binance/spot';
import fs from 'fs';

const secret = require('../.secret.json');

async function main() {
  const spot = await CreateBinanceSpot(secret.exchange);
  const trader = new FullTrader(spot, { USDT: 12 });
  const open_order = await trader.MarketOpenFull('ARB/USDT');
  fs.writeFileSync('output/fopen.json', JSON.stringify(open_order, null, 2));
  const close_order = await trader.MarketCloseFull('ARB/USDT');
  fs.writeFileSync('output/fclose.json', JSON.stringify(close_order, null, 2));
}

main();
