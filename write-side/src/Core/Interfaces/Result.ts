export default interface Result<T> {
    getType():string
    getResult(): T
}