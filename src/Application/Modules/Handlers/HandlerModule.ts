import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import WriteRepositoryModule from '../RepositoryModule/WriteRepositoryModule';
import AddAnItemToCartCommadHandler from '../../../Core/Services/Commands/CommandHandlers/AddAnItemToCartCommandHandler';
import AddItemOneMoreThanCommandHandler from '../../../Core/Services/Commands/CommandHandlers/AddItemOneMoreThanCommandHandler';
const CommandHandlers = [AddAnItemToCartCommadHandler, AddItemOneMoreThanCommandHandler]

@Module({
    imports: [WriteRepositoryModule, CqrsModule],
    providers: [
        ...CommandHandlers
    ]
})
export default class HandlerModule {}