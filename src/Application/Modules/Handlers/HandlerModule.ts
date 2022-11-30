import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import CreateNewCheckoutCommandHandler from '../../../Core/Services/Commands/CommandHandlers/CreateNewCheckoutCommandHandler';
import WriteRepositoryModule from '../RepositoryModule/WriteRepositoryModule';
const CommandHandlers = [CreateNewCheckoutCommandHandler]

@Module({
    imports: [WriteRepositoryModule, CqrsModule],
    providers: [
        ...CommandHandlers
    ]
})
export default class HandlerModule {}