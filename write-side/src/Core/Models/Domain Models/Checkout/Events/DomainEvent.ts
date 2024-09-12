import { IEvent } from "@nestjs/cqrs";
import { randomUUID } from "crypto";

export default abstract class DomainEvent implements IEvent {
    protected readonly id:string
    constructor(){
        this.id = randomUUID()
    }
}