import { binance, ExchangeError } from 'ccxt';
import { Spot } from '../spot';
import { OrderX } from '..';

export
class BinanceSpot extends Spot {
  public constructor(
    public readonly Exchange: binance,
    message?: (data?: any) => void,
  ) { super(message) }

  public async MarketOpen(
    symbol: string,
    funds: number,
    sync = false,
    start_time = Number(new Date()),
  ): Promise<OrderX> {
    try {
      let amount = sync ? await this.syncBalance(symbol, funds, 'quote') : funds;
      amount = this.Exchange.costToPrecision(symbol, amount);
      const order = await this.Exchange.createMarketBuyOrder(symbol, amount, {
        quoteOrderQty: amount,
      });
      const end_time = Number(new Date());
      return {
        ...order,
        start_time, end_time, fee_list: order.trades.map((trade) => trade.fee),
      };
    } catch (e) {
      if (!sync && e instanceof ExchangeError) {
        const [order] = await Promise.all([
          this.MarketOpen(symbol, funds, true, start_time),
          this.message?.(e),
        ]);
        return order;
      }
      throw e;
    }
  }

  public async MarketClose(
    symbol: string,
    assets: number,
    sync = false,
    start_time = Number(new Date()),
  ): Promise<OrderX> {
    try {
      let amount = sync ? await this.syncBalance(symbol, assets, 'base') : assets;
      amount = this.Exchange.amountToPrecision(symbol, amount);
      const order = await this.Exchange.createMarketSellOrder(symbol, amount);
      const end_time = Number(new Date());
      return {
        ...order,
        start_time, end_time, fee_list: order.trades.map((trade) => trade.fee),
      };
    } catch (e) {
      if (!sync && e instanceof ExchangeError) {
        const [order] = await Promise.all([
          this.MarketClose(symbol, assets, true, start_time),
          this.message?.(e),
        ]);
        return order;
      }
      throw e;
    }
  }
}

export
async function CreateBinanceSpot(config: any) {
  const exchange = new BinanceSpot(new binance({ ...config }));
  await exchange.Exchange.loadMarkets();
  return exchange;
}
