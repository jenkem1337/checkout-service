import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import WriteRepositoryModule from '../RepositoryModule/WriteRepositoryModule';
import AddAnItemToCartCommadHandler from '../../../Core/Services/Commands/CommandHandlers/AddAnItemToCartCommandHandler';
import AddItemOneMoreThanCommandHandler from '../../../Core/Services/Commands/CommandHandlers/AddItemOneMoreThanCommandHandler';
import DomainModelFactoryModule from '../DomainModelFactoryModule';
import { CheckoutSagas } from '../../../Core/Services/Sagas/CheckoutSagas';
import TransactionalCommandHandler from '../../../Core/Services/Commands/CommandHandlers/TransactionalCommandHandler';
import PostGreDataSourceModule from '../ORMModule/PostGreDataSourceModule';
const CommandHandlers = [ 
    TransactionalCommandHandler,
    AddAnItemToCartCommadHandler,
    AddItemOneMoreThanCommandHandler]

@Module({
    imports: [PostGreDataSourceModule,WriteRepositoryModule, DomainModelFactoryModule, CqrsModule],
    providers: [
        CheckoutSagas,
        ...CommandHandlers
    ]
})
export default class HandlerModule {}