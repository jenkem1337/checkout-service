import Result from "../../Interfaces/Result";

export default class NullableResult implements Result<void> {
    private readonly type = "NULL"

    getType(): string {
        return this.type
    }
    getResult(): void {
        return
    }

}