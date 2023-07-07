import { ExchangeX } from '.';

export
abstract class Futures extends ExchangeX {
  public async getLastBookTicker(symbol: string) {
    const book = await this.Exchange.fetchOrderBook(symbol, 10);
    return {
      ask1: book.asks[0][0], ask1_volume: book.asks[0][1],
      bid1: book.bids[0][0], bid1_volume: book.bids[0][1],
    };
  }
}
