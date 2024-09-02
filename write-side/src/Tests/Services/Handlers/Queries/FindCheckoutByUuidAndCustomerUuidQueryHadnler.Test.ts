import Result  from '../../../../Core/Interfaces/Result';
import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import CheckoutReadRepositoryImpl from '../../../../Infrastructure/Repository/CheckoutReadRepositoryImpl';
import { MongoClient } from 'mongodb';
import CheckoutQueryModel from '../../../../Core/Models/QueryModels/CheckoutQueryModel';
import { CheckoutStates } from '../../../../Core/Models/ValueObjects/CheckoutState';
import CheckoutByUuidAndCustomerUuidQuery from '../../../../Core/Services/Queries/Query/CheckoutByUuidAndCustomerUuidQuery';
import SuccessResult from '../../../../Core/Models/Result/SuccsessResult';
import FindCheckoutByUuidAndCustomerUuidQueryHandler from '../../../../Core/Services/Queries/QueryHandlers/FindCheckoutByUuidAndCustomerQueryHandler';
import ErrorResult from '../../../../Core/Models/Result/ErrorResult';
describe("FindCheckoutByUuidAndCustomerUuidQueryHandler", () => {
    let queryBus: QueryBus
    let repository: CheckoutReadRepositoryImpl
    let moduleRef: TestingModule
    beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                FindCheckoutByUuidAndCustomerUuidQueryHandler,
                {
                    provide:"CheckoutReadRepository",
                    useClass: CheckoutReadRepositoryImpl
                },
                {
                    provide: "MongoDataSource",
                    useFactory: async () => {
                        const client = new MongoClient("mongodb://127.0.0.1:27017")
                        await client.connect()
                        const db = client.db("checkout_test_db")
                        return db
              
                    }
                },
            ]
        }).compile()

        queryBus = moduleRef.get(QueryBus)
        repository = moduleRef.get("CheckoutReadRepository")

        queryBus.register([
            FindCheckoutByUuidAndCustomerUuidQueryHandler
        ])
    })

    afterEach(() => {
        repository = null
        queryBus = null
        moduleRef = null
    })

    it("should return correct query model when given valid checkout uuid and customer uuid", async () => {
        const customerUuid = randomUUID()
        const checkoutUuid = randomUUID()
        await repository.save(CheckoutQueryModel.valueOf({
            checkoutState: CheckoutStates.CHECKOUT_CREATED,
            createdDate: new Date,
            customerUuid: customerUuid,
            subTotal: 0,
            updatedDate:new Date,
            uuid:checkoutUuid
        }))
        const response = < Result<CheckoutByUuidAndCustomerUuidQuery>>await queryBus.execute(new CheckoutByUuidAndCustomerUuidQuery(checkoutUuid, customerUuid))
        expect(response).toBeInstanceOf(SuccessResult)
        expect(response.getType()).toBe("SUCCESS")
    })

    it("should return error result when given not valid values", async () => {
        const response = <Result<string>> await queryBus.execute(new CheckoutByUuidAndCustomerUuidQuery(randomUUID(), randomUUID()))
        expect(response.getType()).toBe("ERROR")
        expect(response.getResult()).toBe("Checkout Not Found")

    })
})
