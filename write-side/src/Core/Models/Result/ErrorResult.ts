import Result from "../../Interfaces/Result";

export default class ErrorResult<T> implements Result<T> {
    private readonly type = "ERROR"
    constructor(
        private readonly result: T
    ){}
    getType(): string {
        return this.type
    }
    getResult(): T {
        return this.result
    }
    
}