import { Module } from '@nestjs/common';
import { CqrsModule, ICommandHandler } from '@nestjs/cqrs';
import WriteRepositoryModule from '../RepositoryModule/WriteRepositoryModule';
import AddAnItemToCartCommadHandler from '../../../Core/Services/Commands/CommandHandlers/AddAnItemToCartCommandHandler';
import AddItemOneMoreThanCommandHandler from '../../../Core/Services/Commands/CommandHandlers/AddItemOneMoreThanCommandHandler';
import DomainModelFactoryModule from '../DomainModelFactoryModule';
import { CheckoutSagas } from '../../../Core/Services/Sagas/CheckoutSagas';
import TransactionalCommandHandler from '../../../Core/Services/Commands/CommandHandlers/TransactionalCommandHandler';
import PostGreDataSourceModule from '../ORMModule/PostGreDataSourceModule';
import CreateCheckoutCommandHandler from '../../../Core/Services/Commands/CommandHandlers/CreateCheckoutCommandHandler';
import CheckoutCreatedEventHandler from '../../../Core/Services/Events/EventHandlers/CheckoutCreatedEventHandler';
import { ClientsModule, Transport } from '@nestjs/microservices';
const CommandHandlers = [ 
    TransactionalCommandHandler,
    AddAnItemToCartCommadHandler,
    AddItemOneMoreThanCommandHandler,
    CreateCheckoutCommandHandler
]
const EventHandlers = [
    CheckoutCreatedEventHandler
]
@Module({
    imports: [
        PostGreDataSourceModule,
        WriteRepositoryModule, 
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
        ...EventHandlers
    ]
})
export default class HandlerModule {}