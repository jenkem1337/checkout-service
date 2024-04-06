import { CommandBus, CqrsModule } from "@nestjs/cqrs"
import CheckoutRepositoryImpl from '../../../../Infrastructure/Repository/CheckoutRepositoryImpl';
import { IDomainModelFactoryContext } from '../../../../Core/Models/Factories/DomainModelFactoryContext';
import { Test } from "@nestjs/testing";
import CreateCheckoutCommandHandler from '../../../../Core/Services/Commands/CommandHandlers/CreateCheckoutCommandHandler';
import DomainModelFactoryContext from '../../../../Core/Models/Factories/DomainModelFactoryContext';
import NullableCheckoutFactory from '../../../../Core/Models/Factories/Checkout/NullableCheckoutFactory';
import ConcreteCheckoutFactory from '../../../../Core/Models/Factories/Checkout/ConcreteCheckoutFactory';
import ConcreateCheckoutItemFactory from '../../../../Core/Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import NullableCheckoutItemFactory from '../../../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import ConcreateAllArgumentCheckoutFactory from '../../../../Core/Models/Factories/Checkout/ConcreateAllArgumentCheckoutFactory';
import NullableAllArgumentCheckoutFactory from '../../../../Core/Models/Factories/Checkout/NullableAllArgumentCheckoutFactory';
import { DataSource } from 'typeorm';
import CheckoutDataMapper from '../../../../Infrastructure/Entity/CheckoutDataMapper';
import CheckoutItemDataMapper from '../../../../Infrastructure/Entity/CheckoutItemDataMapper';
import CheckoutAggregateMapperContext from '../../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import WriteCheckoutAggregateMapper from "../../../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper";
import CreateCheckoutCommand from '../../../../Core/Services/Commands/Command/CreateCheckoutCommand';
import { randomUUID } from "crypto";
import Checkout from '../../../../Core/Models/Domain Models/Checkout/Checkout';
import CreateCheckoutWithCheckoutCreatedEventFactory from "../../../../Core/Models/Factories/Checkout/CreateCheckoutWithCheckoutCreatedEventFactory";
import NullIdException from '../../../../Core/Exceptions/NullIdException';

describe("AddAnItemToCartCommandHandler", () => {
    let commandBus: CommandBus
    let repository: CheckoutRepositoryImpl
    let factoryCtx: IDomainModelFactoryContext
    let cmdH:CreateCheckoutCommandHandler
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                CreateCheckoutCommandHandler,
                {
                    provide:"DomainModelFactoryContext",
                    useFactory: () => {
                        const factoryCtx: IDomainModelFactoryContext = new DomainModelFactoryContext()
                        factoryCtx.addFactoryClass(NullableCheckoutFactory.name, new NullableCheckoutFactory())
                                .addFactoryClass(ConcreteCheckoutFactory.name, new ConcreteCheckoutFactory)
                                .addFactoryClass(ConcreateCheckoutItemFactory.name, new ConcreateCheckoutItemFactory)
                                .addFactoryClass(NullableCheckoutItemFactory.name, new NullableCheckoutItemFactory)
                                .addFactoryClass(ConcreateAllArgumentCheckoutFactory.name, new ConcreateAllArgumentCheckoutFactory())
                                .addFactoryClass(NullableAllArgumentCheckoutFactory.name, new NullableAllArgumentCheckoutFactory)
                                .addFactoryClass(CreateCheckoutWithCheckoutCreatedEventFactory.name, new CreateCheckoutWithCheckoutCreatedEventFactory())

                            return factoryCtx
            
                    }
                },
                {
                    provide:"CheckoutRepository",
                    useClass: CheckoutRepositoryImpl
                },
                {
                    provide: "DataSource",
                    useFactory: () => {
                        const dataSource = new DataSource({
                            type: 'sqlite',
                            database:':memory:',
                            entities: [
                                CheckoutDataMapper, CheckoutItemDataMapper
                            ],
                            synchronize: true,
                          });
                      
                          return dataSource.initialize();
                    }
                },
                {
                    provide: CheckoutAggregateMapperContext.name,
                    useFactory: (domainModelFactoryCtx: IDomainModelFactoryContext) => {
                        const context = new CheckoutAggregateMapperContext
                        context.setStrategy(new WriteCheckoutAggregateMapper(domainModelFactoryCtx))
                        return context;
                    },
                    inject: [{token: "DomainModelFactoryContext", optional:false}]
                }
            ]
        }).compile()

        commandBus = moduleRef.get(CommandBus)
        repository = moduleRef.get("CheckoutRepository")
        factoryCtx = moduleRef.get("DomainModelFactoryContext")
        cmdH = moduleRef.get(CreateCheckoutCommandHandler)

        commandBus.register([
            CreateCheckoutCommandHandler
        ])
    })

    afterEach(() => {
        repository = null
        commandBus = null
    })
    it("should persist new checkout" , async () => {
        const checkoutUuid = await commandBus.execute(new CreateCheckoutCommand(randomUUID()))
        const checkoutDomainModel = await repository.findOneByUuid(checkoutUuid)
        expect(checkoutDomainModel).toBeInstanceOf(Checkout)
    })

    it("should throw NullIdException when customer uuid given null",async () => {
        await expect(async () => await cmdH.execute(new CreateCheckoutCommand(null)))
            .rejects
            .toThrow(NullIdException)
    })
})