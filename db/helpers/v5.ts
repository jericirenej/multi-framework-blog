import { v5 } from "uuid";

export class UUIDv5 {
  protected readonly defaultNamespace = "980533f1-be12-4e95-8a00-faa63d7a35e0";
  protected readonly identifier: string;
  constructor(identifier: string) {
    this.identifier = v5(identifier, this.defaultNamespace);
  }
  generate(...parts: (string | number)[]) {
    return v5(parts.join("-"), this.identifier);
  }
}
