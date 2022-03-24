export class AnketService {
  private data: string[] = ['Vlad', 'Egor', 'Vitaliy', 'Yana'];

  getData(): string[] {
    return this.data;
  }

  addData(name: string) {
    this.data.push(name);
  }

  deleteData(name: string) {
    let itemId = this.data.findIndex((item) => item.match(name));
    this.data.splice(itemId, 1);
  }
}
