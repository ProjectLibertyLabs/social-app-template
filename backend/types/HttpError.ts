import { HttpStatusCode } from "axios";

export class HttpError extends Error {
    constructor(public readonly code: HttpStatusCode, message?: string, options?: ErrorOptions) {
        super(message, options);
    }

    public toString() {
        return `${super.toString()} (HTTP ${this.code})`;
    }
}
