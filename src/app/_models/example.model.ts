export class Example {
  name: string;
  string: string;
  date: Date;

  constructor(data: any) {
    this.name = data.name ?? 0;
    this.string = data.string ?? 0;
    this.date = data.date ?? new Date();
  }
}
