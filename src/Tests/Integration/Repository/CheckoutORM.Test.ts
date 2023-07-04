import { CheckoutStates } from './../../../Core/Models/ValueObjects/CheckoutState';
import {Test} from '@nestjs/testing'
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import CheckoutDataMapper from '../../../Infrastructure/Entity/CheckoutDataMapper';
import CheckoutItemDataMapper from '../../../Infrastructure/Entity/CheckoutItemDataMapper';
import { Scope } from '@nestjs/common';
import { PeymentMethodEnum } from '../../../Core/Models/ValueObjects/PeymentMethod';
describe('Checkout ORM Test', () => {
    let testDataSource: DataSource
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [{
                provide: 'TestDataSource',
                useFactory: async () => {
                  const dataSource = new DataSource({
                    type: 'sqlite',
                    database:":memory:",
                    dropSchema:true,
                    entities: [
                      CheckoutDataMapper, CheckoutItemDataMapper
                    ],
                    synchronize:true
                  });
              
                  return dataSource.initialize();
                },
                scope:Scope.DEFAULT,
              
              }]
        }).compile()

        testDataSource = moduleRef.get<DataSource>("TestDataSource");
    })

    afterEach(() => {
        testDataSource = null
    })

    it('should return an instance of Checkout data model when save and get', async () => {
        const checkoutUuid = randomUUID()
        const checkoutDataMapper = new CheckoutDataMapper(checkoutUuid, randomUUID(), 150, 0, PeymentMethodEnum.CREDIT_CART, CheckoutStates.CHECKOUT_CREATED)
        await testDataSource.manager.save(checkoutDataMapper)
        const checkoutFromDb = await testDataSource.manager.findOne(CheckoutDataMapper, {
            where: {
                uuid: checkoutUuid
            }
        })
        expect(checkoutFromDb).toBeTruthy()
        expect(checkoutFromDb.checkoutState).toBe(CheckoutStates.CHECKOUT_CREATED)
    })

    it('should return an instance of Checkout data model when save with CheckoutItem and get', async () => {
        const checkoutItem1 = new CheckoutItemDataMapper(randomUUID(), 40, 1, 'Product 1', randomUUID())
        const checkoutItem2 = new CheckoutItemDataMapper(randomUUID(), 60, 1, 'Product 2', randomUUID())
        const checkoutUuid = randomUUID()
        const checkoutDataMapper = new CheckoutDataMapper(checkoutUuid, randomUUID(), 100, 0, PeymentMethodEnum.CREDIT_CART, CheckoutStates.CHECKOUT_CREATED, 
            [
                checkoutItem1, checkoutItem2
            ]
        )
        
        await testDataSource.manager.save(checkoutDataMapper)
        
        const checkoutFromDb = await testDataSource.manager.findOne(CheckoutDataMapper, {
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: checkoutUuid
            }
        })
        expect(checkoutFromDb).toBeTruthy()
        expect(checkoutFromDb.checkoutState).toBe(CheckoutStates.CHECKOUT_CREATED)
    })

    it('should return an instance of CheckoutItem when save and get via Checkout data mapper', async () => {
        const checkoutItem1 = new CheckoutItemDataMapper(randomUUID(), 40, 1, 'Product 1', randomUUID())
        const checkoutItem2 = new CheckoutItemDataMapper(randomUUID(), 60, 1, 'Product 2', randomUUID())
        const checkoutUuid = randomUUID()
        const checkoutDataMapper = new CheckoutDataMapper(checkoutUuid, randomUUID(), 100, 0, PeymentMethodEnum.CREDIT_CART, CheckoutStates.CHECKOUT_CREATED, 
            [
                checkoutItem1, checkoutItem2
            ]
        )
        
        await testDataSource.manager.save(checkoutDataMapper)
        
        const checkoutFromDb = await testDataSource.manager.findOne(CheckoutDataMapper, {
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: checkoutUuid
            }
        })

        const checkoutItems = checkoutFromDb.checkoutItems
        expect(checkoutItems.length).toBe(2)
        expect(checkoutItems[0].productHeader).toBe('Product 1')
        expect(checkoutItems[1].productHeader).toBe('Product 2')
    })

    it('should return zero when deleted two item', async () => {
        const checkoutItem1 = new CheckoutItemDataMapper(randomUUID(), 40, 1, 'Product 1', randomUUID())
        const checkoutItem2 = new CheckoutItemDataMapper(randomUUID(), 60, 1, 'Product 2', randomUUID())
        const checkoutUuid = randomUUID()
        const checkoutDataMapper = new CheckoutDataMapper(checkoutUuid, randomUUID(), 100, 0, PeymentMethodEnum.CREDIT_CART, CheckoutStates.CHECKOUT_CREATED, 
            [
                checkoutItem1, checkoutItem2
            ]
        )
        
        await testDataSource.manager.save(checkoutDataMapper)
        
        const checkoutFromDb = await testDataSource.manager.findOne(CheckoutDataMapper, {
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: checkoutUuid
            }
        })

        checkoutFromDb.checkoutItems.pop()
        checkoutFromDb.checkoutItems.pop()

        const checkoutFromDb2 = await testDataSource.manager.save(checkoutFromDb)
        expect(checkoutFromDb2.checkoutItems.length).toBe(0)
    })

    it('balaablabla', async () => {
        let checkoutData = new CheckoutDataMapper
        let uuid = randomUUID()
        
        checkoutData.uuid = uuid
        checkoutData.customerUuid = randomUUID()
        checkoutData.subTotal = 1111
        checkoutData.checkoutState = CheckoutStates.CHECKOUT_COMPLETED
        await testDataSource.manager.save(checkoutData)
        
        const checkoutFromDb = await testDataSource.manager.findOne(CheckoutDataMapper, {
            where: {
                uuid: uuid
            }
        })

        expect(checkoutFromDb.shippingPrice).toBe(0)

    })
})