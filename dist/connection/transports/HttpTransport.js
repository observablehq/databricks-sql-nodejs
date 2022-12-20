"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpTransport {
    constructor(httpOptions = {}) {
        this.httpOptions = httpOptions;
    }
    getTransport() {
        return this.httpOptions;
    }
    setOptions(option, value) {
        this.httpOptions = Object.assign(Object.assign({}, this.httpOptions), { [option]: value });
    }
    getOptions() {
        return this.httpOptions;
    }
    connect() { }
    addListener() { }
    removeListener() { }
    write() { }
    end() { }
    emit() { }
}
exports.default = HttpTransport;
//# sourceMappingURL=HttpTransport.js.map