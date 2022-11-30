import { CommandHandler, EventPublisher } from "@nestjs/cqrs";
import AddAnItemCommand from '../../../../Core/Services/Commands/Command/AddAnItemCommand';
import AddAnItemToCartCommadHandler from '../../../../Core/Services/Commands/CommandHandlers/AddAnItemToCartCommandHandler';
import CheckoutRepository from '../../../../Core/Interfaces/CheckoutRepository';
import { Inject } from "@nestjs/common";
import InMemoryCheckoutRepositoryImpl from '../../../../Infrastructure/Repository/InMemoryCheckoutRepositoryImpl';

@CommandHandler(AddAnItemCommand)
export default class StubAddAnItemToCartCommandHandler extends AddAnItemToCartCommadHandler {
    constructor(
            @Inject(InMemoryCheckoutRepositoryImpl.name)
            inMemoryCheckoutRepo: CheckoutRepository,
            
            eventPublisher: EventPublisher
        ){
        super(inMemoryCheckoutRepo, eventPublisher)
    }
}