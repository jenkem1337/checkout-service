import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import AddAnItemToCartCommadHandler from '../../../Core/Services/Commands/CommandHandlers/AddAnItemToCartCommandHandler';
import AddItemOneMoreThanCommandHandler from '../../../Core/Services/Commands/CommandHandlers/AddItemOneMoreThanCommandHandler';
import DomainModelFactoryModule from '../DomainModelFactoryModule';
import PostGreDataSourceModule from '../DatabaseConnectionModule/PostGreDataSourceModule';
import CreateCheckoutCommandHandler from '../../../Core/Services/Commands/CommandHandlers/CreateCheckoutCommandHandler';
import CheckoutCreatedEventHandler from '../../../Core/Services/Events/EventHandlers/CheckoutCreatedEventHandler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import CheckoutCancelledEventHandler from 'src/Core/Services/Events/EventHandlers/CheckoutCancelledEventHandler';
import CancelCheckoutCommandHandler from 'src/Core/Services/Commands/CommandHandlers/CancelCheckoutCommandHandler';
import AnCheckoutItemAddedEventHandler from 'src/Core/Services/Events/EventHandlers/AnCheckoutItemAddedEventHandler';
import ItemQuantityIncreasedEventHandler from 'src/Core/Services/Events/EventHandlers/ItemQuantityIncreasedEventHandler';
import TakeOutAnItemFromCheckoutCommandHandler from 'src/Core/Services/Commands/CommandHandlers/TakeOutAnItemFromCheckoutCommandHandler';
import AnItemDeletedEventHandler from 'src/Core/Services/Events/EventHandlers/AnItemDeletedEventHandler';
import ItemDeletedEventHandler from 'src/Core/Services/Events/EventHandlers/ItemDeletedEventHandler';
import TakeOutOneMoreThanItemCommandHandler from 'src/Core/Services/Commands/CommandHandlers/TakeOutOneMoreThanItemCommandHandler';
import ItemQuantityDecreasedEventHandler from 'src/Core/Services/Events/EventHandlers/ItemQuantityDecreasedEventHandler';
import TakeOutSameItemsFromCheckoutCommandHandler from 'src/Core/Services/Commands/CommandHandlers/TakeOutSameItemsFromCheckoutCommandHandler';
import WriteRepositoryFactoryModule from '../RepositoryModule/WriteCheckoutRepositoryFactory';
import { AlsModule } from '../AlsModule';
const CommandHandlers = [ 
    AddAnItemToCartCommadHandler,
    AddItemOneMoreThanCommandHandler,
    CreateCheckoutCommandHandler,
    CancelCheckoutCommandHandler,
    TakeOutAnItemFromCheckoutCommandHandler,
    TakeOutOneMoreThanItemCommandHandler,
    TakeOutSameItemsFromCheckoutCommandHandler
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
        AlsModule,
        PostGreDataSourceModule,
        WriteRepositoryFactoryModule,
        DomainModelFactoryModule, 
        CqrsModule,
        ClientsModule.registerAsync([
            {
              name: 'CHECKOUT_PROJECTION_SERVICE',
              useFactory: async () => ({
                transport: Transport.REDIS,
                options: {
                  host: process.env.MESSAGE_QUEUE_HOST,
                  port: parseInt(process.env.MESSAGE_QUEUE_PORT,10)
                },
              }),
            },
          ]),
          ],
    providers: [
        ...CommandHandlers,
        ...EventHandlers
    ]
})
export default class HandlerModule implements OnModuleInit{
    onModuleInit() {
        console.log(`redis host name::${process.env.MESSAGE_QUEUE_HOST}`)
    }
}