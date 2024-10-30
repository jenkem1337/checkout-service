import NullIdException from "../../Exceptions/NullIdException";
import WrongUuidException from "../../Exceptions/WrongUuidException";
import ValueObject from "../ValueObject";
import validator from "validator";

export default abstract class BaseUUIDValueObject extends ValueObject {
    private readonly uuid: string
    constructor(uuid:string) {
        super()
        if(!uuid){
            throw new NullIdException();
        }
        
        if(!validator.isUUID(uuid)){
            throw new WrongUuidException();
        }
        this.uuid = uuid
    }
    getUuid():string{
        return this.uuid
    }
    equals(obj: Object): boolean {
        if(obj === this) return true;
        if(obj === null || undefined) return false;
        const that: BaseUUIDValueObject = <BaseUUIDValueObject> obj;
        
        return this.uuid === that.getUuid();
    }
}