import CheckoutAggregateMapperContext from "./Mapper/CheckoutAggregateMapperContext";
import CheckoutRepositoryImpl from "./CheckoutRepositoryImpl";
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";
import IEntityManagerFactory from "src/Core/Interfaces/IEntityManagerFactory";

export default class CheckoutRepositoryFactory implements ICheckoutRepositoryFactory{
    private readonly entityManagerFactory:IEntityManagerFactory
    private readonly omc: CheckoutAggregateMapperContext
    constructor(entityManagerFactory:IEntityManagerFactory, omc:CheckoutAggregateMapperContext){
        this.entityManagerFactory = entityManagerFactory
        this.omc = omc
    }
    createCheckoutRepository(){
        return new CheckoutRepositoryImpl(this.entityManagerFactory.createEntityManager(), this.omc)
    }
}