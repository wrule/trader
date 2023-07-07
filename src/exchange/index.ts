import { Exchange, Order } from 'ccxt';

export
abstract class ExchangeX {
  public abstract Exchange: Exchange;
  public abstract MarketOpen(symbol: string, funds: number): Promise<OrderX>;
  public abstract MarketClose(symbol: string, assets: number): Promise<OrderX>;
}

export
interface OrderX extends Order {
  start_time: number;
  end_time: number;
  fee_list: { currency: string, cost: number }[];
}
