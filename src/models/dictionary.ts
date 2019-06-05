function init<T>(a: T, b: T) {
  Object.assign(a, b);
}

export interface DictionaryData {
  [key: string]: string[];
}

export interface Dictionary extends DictionaryData {}

export class Dictionary {
  constructor(data: DictionaryData) {
    init(this, data);
  }

  // @ts-ignore
  sample(name: string): string {
    try {
      return this[name][Math.floor(Math.random() * this[name].length)];
    } catch (e) {
      // 指定した辞書が存在しなかった場合
      console.error(e);
      return 'あふん';
    }
  }
}
