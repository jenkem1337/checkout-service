import AggregateRootEntity from "../Models/AggregateRootEntity";
import BaseUUIDValueObject from '../Models/ValueObjects/BaseUUIDValueObject';

export default interface Repository<RT, MRT, T extends AggregateRootEntity<BaseUUIDValueObject>>{
    saveChanges(aggregateRoot: T):void
    findOneByUuid(candidateKey:string):RT
    findManyByUuid(candidateKey:string): MRT
}