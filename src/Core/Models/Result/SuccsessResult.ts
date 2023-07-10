import Result from "./Result";

export default class SuccessResult<T> implements Result<T>{
    private readonly type = "SUCCESS"

    constructor(
        private readonly result:T
    ){}
    getType(): string {
        return this.type
    }
    getResult(): T {
        return this.result
    }

} 