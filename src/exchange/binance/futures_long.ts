// 2023年07月06日13:10:20
import { binance } from 'ccxt';
import { Futures } from '../futures';
import { OrderX } from '..';

export
class BinanceFuturesLong extends Futures {
  public constructor(public readonly Exchange: binance) { super() }

  public async MarketOpen(symbol: string, funds: number): Promise<OrderX> {
    const start_time = Number(new Date());
    const ticker = await this.getLastBookTicker(symbol);
    const amount = this.Exchange.amountToPrecision(symbol, funds / ticker.ask1);
    const order = await this.Exchange.createMarketBuyOrder(symbol, amount, {
      positionSide: 'LONG',
    });
    const end_time = Number(new Date());
    const market = this.Exchange.market(symbol);
    return {
      ...order,
      start_time, end_time, fee_list: [{
        currency: market.quote,
        cost: order.cost * (market.taker ?? 0.0004),
      }],
    };
  }

  public async MarketClose(symbol: string, assets: number): Promise<OrderX> {
    const start_time = Number(new Date());
    const amount = this.Exchange.amountToPrecision(symbol, assets);
    const order = await this.Exchange.createMarketSellOrder(symbol, amount, {
      positionSide: 'LONG',
    });
    const end_time = Number(new Date());
    const market = this.Exchange.market(symbol);
    return {
      ...order,
      start_time, end_time, fee_list: [{
        currency: market.quote,
        cost: order.cost * (market.taker ?? 0.0004),
      }],
    };
  }
}

export
async function CreateBinanceFuturesLong(config: any) {
  const exchange = new BinanceFuturesLong(new binance({
    ...config,
    options: {
      defaultType: 'future',
      hedgeMode: true,
      ...config.options,
    },
  }));
  await exchange.Exchange.loadMarkets();
  return exchange;
}
