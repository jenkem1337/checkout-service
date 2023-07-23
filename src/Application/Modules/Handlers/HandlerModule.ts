import { Module } from '@nestjs/common';
import { CqrsModule, ICommandHandler } from '@nestjs/cqrs';
import WriteRepositoryModule from '../RepositoryModule/WriteRepositoryModule';
import AddAnItemToCartCommadHandler from '../../../Core/Services/Commands/CommandHandlers/AddAnItemToCartCommandHandler';
import AddItemOneMoreThanCommandHandler from '../../../Core/Services/Commands/CommandHandlers/AddItemOneMoreThanCommandHandler';
import DomainModelFactoryModule from '../DomainModelFactoryModule';
import { CheckoutSagas } from '../../../Core/Services/Sagas/CheckoutSagas';
import TransactionalCommandHandler from '../../../Core/Services/Commands/CommandHandlers/TransactionalCommandHandler';
import PostGreDataSourceModule from '../DatabaseConnectionModule/PostGreDataSourceModule';
import CreateCheckoutCommandHandler from '../../../Core/Services/Commands/CommandHandlers/CreateCheckoutCommandHandler';
import CheckoutCreatedEventHandler from '../../../Core/Services/Events/EventHandlers/CheckoutCreatedEventHandler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import FindCheckoutByUuidAndCustomerUuidQueryHandler from 'src/Core/Services/Queries/QueryHandlers/FindCheckoutByUuidAndCustomerQueryHandler';
import ReadRepositoryModule from '../RepositoryModule/ReadRepositoryModule';
import CheckoutCancelledEventHandler from 'src/Core/Services/Events/EventHandlers/CheckoutCancelledEventHandler';
import CancelCheckoutCommandHandler from 'src/Core/Services/Commands/CommandHandlers/CancelCheckoutCommandHandler';
import RedisPubSubModule from '../QueueModule/RedisPubSubModule';
import AnCheckoutItemAddedEventHandler from 'src/Core/Services/Events/EventHandlers/AnCheckoutItemAddedEventHandler';
import ItemQuantityIncreasedEventHandler from 'src/Core/Services/Events/EventHandlers/ItemQuantityIncreasedEventHandler';
const CommandHandlers = [ 
    TransactionalCommandHandler,
    AddAnItemToCartCommadHandler,
    AddItemOneMoreThanCommandHandler,
    CreateCheckoutCommandHandler,
    CancelCheckoutCommandHandler
]
const QueryHandlers = [
    FindCheckoutByUuidAndCustomerUuidQueryHandler
]
const EventHandlers = [
    CheckoutCreatedEventHandler,
    CheckoutCancelledEventHandler,
    AnCheckoutItemAddedEventHandler,
    ItemQuantityIncreasedEventHandler
]
@Module({
    imports: [
        RedisPubSubModule,
        PostGreDataSourceModule,
        WriteRepositoryModule, 
        ReadRepositoryModule,
        DomainModelFactoryModule, 
        CqrsModule,
        ClientsModule.register([{
            name:"CHECKOUT_PROJECTION_SERVICE",
            transport:Transport.REDIS,
            options: {
                host:"localhost",
                port:6379
            }
            }])
    
    ],
    providers: [
        CheckoutSagas,
        ...CommandHandlers,
        ...QueryHandlers,
        ...EventHandlers
    ]
})
export default class HandlerModule {}