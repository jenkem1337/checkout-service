import BaseUUIDValueObject from './ValueObjects/BaseUUIDValueObject';
export default interface EntityInterface<T extends BaseUUIDValueObject> {
    getUuid():T
    getCreatedAt():Date
    getUpdatedAt():Date
    isNull():boolean
    isNotNull():boolean
}