import EntityInterface from '../Interfaces/EntityInterface';
import BaseUUIDValueObject from './ValueObjects/BaseUUIDValueObject';
import NullPropertyException from '../Exceptions/NullPropertyException';
export default abstract class Entity<T extends BaseUUIDValueObject> implements EntityInterface<T> {
    private uuid: T
    private createdAt: Date
    private updatedAt: Date
    constructor(uuid: T, createdAt:Date, updatedAt:Date){
        
        if(!createdAt) throw new NullPropertyException('created at date')
        if(!updatedAt) throw new NullPropertyException('updated at date')
        
        this.uuid = uuid
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
    getUuid(): T {
        return this.uuid
    }
    getCreatedAt(): Date {
        return this.createdAt
    }
    getUpdatedAt(): Date {
        return this.updatedAt
    }
    isNull(): boolean {
        return false
    }
    isNotNull(): boolean {
        return true 
    }

}