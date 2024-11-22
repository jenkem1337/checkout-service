import { Inject, Post } from '@nestjs/common';
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ClientKafka } from "@nestjs/microservices";
import CheckoutCompleted from "src/Core/Models/Domain Models/Checkout/Events/CheckoutCompleted";
import { HttpService } from '@nestjs/axios';
import { catchError, of } from 'rxjs';

@EventsHandler(CheckoutCompleted)
export default class CheckoutCompletedEventHandler implements IEventHandler<CheckoutCompleted> {
    constructor(
        private readonly orderService:HttpService,
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly projectionClient:ClientKafka
    ){}
    
    handle(event: CheckoutCompleted) {
        this.projectionClient.emit("checkout-completed", JSON.parse(JSON.stringify(event)))
    }
    
}