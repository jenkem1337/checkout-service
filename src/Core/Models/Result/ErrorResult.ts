import Result from "./Result";

export default class ErrorResult implements Result<string> {
    private readonly type = "ERROR"
    constructor(
        private readonly result: string
    ){}
    getType(): string {
        return this.type
    }
    getResult(): string {
        return this.result
    }
    
}