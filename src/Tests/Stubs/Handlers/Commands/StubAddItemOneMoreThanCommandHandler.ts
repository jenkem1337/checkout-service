import { Inject } from "@nestjs/common";
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import AddItemOneMoreThanCommand from '../../../../Core/Services/Commands/Command/AddItemOneMoreThanCommand';
import InMemoryCheckoutRepositoryImpl from '../../../../Infrastructure/Repository/InMemoryCheckoutRepositoryImpl';
import CheckoutRepository from '../../../../Core/Interfaces/CheckoutRepository';
import AddItemOneMoreThanCommandHandler from '../../../../Core/Services/Commands/CommandHandlers/AddItemOneMoreThanCommandHandler';

@CommandHandler(AddItemOneMoreThanCommand)
export default class StubAddItemOneMoreThanCommandHandler extends AddItemOneMoreThanCommandHandler {
    constructor(
        @Inject(InMemoryCheckoutRepositoryImpl.name)
        inMemoryRepository:CheckoutRepository,
        eventPublisher:EventPublisher
    ){
        super(inMemoryRepository, eventPublisher)
    }
}