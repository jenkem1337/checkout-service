import QueryModel from "./QueryModel";

export default class NullCheckoutQueryModel implements QueryModel {
    private constructor(){}
    static valueOf(){
        return new NullCheckoutQueryModel
    }

    isNull(): boolean {
        return true
    }
}