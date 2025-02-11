export class MultipartMessage {
  public content: string;

  constructor(public boundary: string, partSizes: number[]) {
    let parts = [];
    for (let i = 0; i < partSizes.length; i++) {
      parts.push(`--${boundary}`);
      parts.push(`Content-Disposition: form-data; name="file${i}"; filename="file${i}.txt"`);
      parts.push('Content-Type: text/plain');
      parts.push('');
      parts.push('x'.repeat(partSizes[i]));
    }
    parts.push(`--${boundary}--`);

    this.content = parts.join('\r\n');
  }

  *generateChunks(chunkSize = 16 * 1024): Generator<Uint8Array> {
    let encoder = new TextEncoder();
    for (let i = 0; i < this.content.length; i += chunkSize) {
      yield encoder.encode(this.content.slice(i, i + chunkSize));
    }
  }
}

const oneKb = 1024;
const oneMb = 1024 * oneKb;

export const oneSmallFile = new MultipartMessage('----WebKitFormBoundaryzv0Og5zWtGjvzP2A', [oneKb]);

export const oneLargeFile = new MultipartMessage('----WebKitFormBoundaryzv0Og5zWtGjvzP2A', [
  10 * oneMb,
]);

export const oneHundredSmallFiles = new MultipartMessage(
  '----WebKitFormBoundaryzv0Og5zWtGjvzP2A',
  Array(100).fill(oneKb)
);

export const fiveLargeFiles = new MultipartMessage('----WebKitFormBoundaryzv0Og5zWtGjvzP2A', [
  10 * oneMb,
  10 * oneMb,
  10 * oneMb,
  20 * oneMb,
  50 * oneMb,
]);
