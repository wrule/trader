// 2023年07月06日13:25:58
export
class Trader {
  public constructor(assets: { [name: string]: number } = { }) {
    this.wallet = new Map<string, number>(Object.entries(assets));
  }

  private wallet: Map<string, number>;

  public Get(name: string) {
    return this.wallet.get(name) ?? 0;
  }

  public Send(name: string, amount: number) {
    this.wallet.set(name, this.Get(name) - amount);
  }

  public Receive(name: string, amount: number) {
    this.wallet.set(name, this.Get(name) + amount);
  }

  public States() {
    return Object.fromEntries(this.wallet.entries());
  }
}
