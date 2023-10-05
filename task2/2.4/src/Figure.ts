export class Figure {
  private name: string;

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  constructor(name: string) {
    this.name = name;
  }
}
