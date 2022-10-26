import { v1 as uuid } from 'uuid';

export class GeneratorService {
  public uuid(): string {
    return uuid();
  }

  public fileName(ext: string): string {
    return this.uuid() + '.' + ext;
  }
}
