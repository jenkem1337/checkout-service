export interface DomainModelFactory<T extends object, O> {
    createInstance(constructerValues: O): T
}
