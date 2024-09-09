import QueryModel from "./QueryModel";

export default class NullCheckoutItemQueryModel implements QueryModel {
    private constructor(){}
    static valueOf(){
        return new NullCheckoutItemQueryModel
    }

    isNull(): boolean {
        return true
    }
}