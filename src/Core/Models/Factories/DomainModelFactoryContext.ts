import CheckoutItemInterface from "../Domain Models/Checkout/CheckoutItemInterface";
import CheckoutConstructorParamaters from "./Checkout/CheckoutConstructorParameters";
import ConcreateCheckoutItemFactory from "./CheckoutItem/ConcreateCheckoutItem";
import { DomainModelFactory } from "./DomainModelFactory";
interface InstanceCreator {
    createInstance<T extends object, V extends object>(constructorParameters: V): T
}
export interface IDomainModelFactoryContext {
    addFactoryClass(key:string, value:DomainModelFactory<object, object>):IDomainModelFactoryContext
    setFactoryMethod(key:string):InstanceCreator
    directlyGetFactoryMethod<K extends object,V extends object>(key:string): DomainModelFactory<K, V>
}

export default class DomainModelFactoryContext implements InstanceCreator, IDomainModelFactoryContext{
    private factoryClassHashTable: Map<string, DomainModelFactory<object, object>> = new Map<string, DomainModelFactory<object, object>>()
    private factoryMethod: DomainModelFactory<object, object>
    
    addFactoryClass(key:string, value:DomainModelFactory<object, object>){
        if(this.factoryClassHashTable.has(key)) return
        this.factoryClassHashTable.set(key, value)
        return this
    }
    directlyGetFactoryMethod<K extends object,V extends object>(key:string): DomainModelFactory<K, V> {
        if(!this.factoryClassHashTable.has(key)) throw new Error("This factory method does not exist in hash table")
        this.factoryMethod = this.factoryClassHashTable.get(key) 

        return this.factoryMethod as DomainModelFactory<K, V>
    }
    setFactoryMethod(key:string):InstanceCreator{
        if(!this.factoryClassHashTable.has(key)) throw new Error("This factory method does not exist in hash table")
        this.factoryMethod = this.factoryClassHashTable.get(key)
        return this
    }
    createInstance<T extends object, V extends object>(constructorParameters: V): T {
        return this.factoryMethod.createInstance(constructorParameters) as T
    }
}

