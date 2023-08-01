import { Test } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import CheckoutReadRepositoryImpl from '../../../Infrastructure/Repository/CheckoutReadRepositoryImpl';
import CheckoutQueryModel from '../../../Core/Models/QueryModels/CheckoutQueryModel';
import { CheckoutStates } from '../../../Core/Models/ValueObjects/CheckoutState';
import { randomUUID } from 'crypto';
import CheckoutItemQueryModel from '../../../Core/Models/QueryModels/CheckoutItemQueryModel';



describe('Read Checkout Repository', () => {
    let checkoutRepository: CheckoutReadRepositoryImpl = null
    
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CheckoutReadRepositoryImpl, {
                provide: 'MongoDataSource',
                useFactory: async () => {
                    const client = new MongoClient("mongodb://127.0.0.1:27017")
                    await client.connect()
                    const clientDb = client.db("checkout_test_db")
                    return clientDb
                },
            },
        ]
        }).compile()

        checkoutRepository = await moduleRef.resolve<CheckoutReadRepositoryImpl>(CheckoutReadRepositoryImpl)
    })

    afterEach(() => {
        checkoutRepository = null
    })


    it("should insert and return valid query model", async () => {
        const checkoutUuid = randomUUID()
        await checkoutRepository.save(
            CheckoutQueryModel.valueOf({
                checkoutState: CheckoutStates.CHECKOUT_CREATED,
                createdDate:new Date,
                customerUuid:randomUUID(),
                peymentMethod:null,
                shippingPrice: 0,
                subTotal: 150,
                updatedDate: new Date,
                uuid:checkoutUuid
            })
        )

        const checkoutQueryModel = await checkoutRepository.findOneByUuid(checkoutUuid)
        expect(checkoutQueryModel).toBeInstanceOf(CheckoutQueryModel)
    })

    it("should insert and return valid CheckoutItemQueryModel", async () => {
        const checkoutUuid = randomUUID()
        const checkoutItemUuid = randomUUID()

        await checkoutRepository.save(
            CheckoutQueryModel.valueOf({
                checkoutState: CheckoutStates.CHECKOUT_CREATED,
                createdDate:new Date,
                customerUuid:randomUUID(),
                peymentMethod:null,
                shippingPrice: 0,
                subTotal: 150,
                updatedDate: new Date,
                uuid:checkoutUuid
            })
        )
        await checkoutRepository.saveCheckoutItem(
            CheckoutItemQueryModel.valueOf({
                checkoutUuid: checkoutUuid,
                createdDate:new Date,
                productBasePrice: 150,
                productHeader:"Product 1",
                productQuantity:1,
                productUuid:randomUUID(),
                updatedDate:new Date,
                uuid:checkoutItemUuid
            })
        )
        const checkoutQueryModel = await checkoutRepository.findOneByUuid(checkoutUuid) as CheckoutQueryModel
        expect(checkoutQueryModel).toBeInstanceOf(CheckoutQueryModel)
        const checkoutItemQueryModel = checkoutQueryModel.checkoutItemDocument[0]
        expect(checkoutItemQueryModel).toBeInstanceOf(CheckoutItemQueryModel)
        expect(checkoutItemQueryModel.checkoutUuid).toBe(checkoutUuid)

    })
})