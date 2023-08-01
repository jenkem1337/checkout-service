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
import TakeOutAnItemFromCheckoutCommandHandler from 'src/Core/Services/Commands/CommandHandlers/TakeOutAnItemFromCheckoutCommandHandler';
import AnItemDeletedEventHandler from 'src/Core/Services/Events/EventHandlers/AnItemDeletedEventHandler';
import ItemDeletedEventHandler from 'src/Core/Services/Events/EventHandlers/ItemDeletedEventHandler';
import TakeOutOneMoreThanItemCommandHandler from 'src/Core/Services/Commands/CommandHandlers/TakeOutOneMoreThanItemCommandHandler';
import ItemQuantityDecreasedEventHandler from 'src/Core/Services/Events/EventHandlers/ItemQuantityDecreasedEventHandler';
import TakeOutSameItemsFromCheckoutCommandHandler from 'src/Core/Services/Commands/CommandHandlers/TakeOutSameItemsFromCheckoutCommandHandler';
const CommandHandlers = [ 
    TransactionalCommandHandler,
    AddAnItemToCartCommadHandler,
    AddItemOneMoreThanCommandHandler,
    CreateCheckoutCommandHandler,
    CancelCheckoutCommandHandler,
    TakeOutAnItemFromCheckoutCommandHandler,
    TakeOutOneMoreThanItemCommandHandler,
    TakeOutSameItemsFromCheckoutCommandHandler
]
const QueryHandlers = [
    FindCheckoutByUuidAndCustomerUuidQueryHandler
]
const EventHandlers = [
    CheckoutCreatedEventHandler,
    CheckoutCancelledEventHandler,
    AnCheckoutItemAddedEventHandler,
    ItemQuantityIncreasedEventHandler,
    AnItemDeletedEventHandler,
    ItemDeletedEventHandler,
    ItemQuantityDecreasedEventHandler
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