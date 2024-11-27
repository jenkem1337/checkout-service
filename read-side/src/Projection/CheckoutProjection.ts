import { Controller, Inject } from "@nestjs/common";
import {Ctx, EventPattern, KafkaContext, Payload} from "@nestjs/microservices"
import CheckoutQueryModel from '../Model/CheckoutQueryModel';
import CheckoutItemQueryModel from '../Model/CheckoutItemQueryModel';
import ReadCheckoutRepository from '../Repository/CheckoutReadRepository';
import IdempotentMessageRepository from "src/Repository/IdempotentMessageRepository";
@Controller()
export default class CheckoutProjection {

    constructor(
        @Inject("CheckoutReadRepository")
        private readonly chekcoutReadRepository: ReadCheckoutRepository,
        @Inject("IdempotentMessageRepository")
        private readonly idempotentMessageRepository: IdempotentMessageRepository
    ){}
    @EventPattern("checkout_created")
    async handleCheckoutCreatedEvent(@Payload() event:any, @Ctx() context: KafkaContext){
        console.log(event.id + ": event id")
        
        if(await this.idempotentMessageRepository.isMessageExist(event.id)){
            console.log("This message allready computed")
            return
        }
        
        const checkoutQueryModel = CheckoutQueryModel.valueOf({
            checkoutState: event.checkoutState.state,
            createdDate: event.createdAt,
            customerUuid: event.userUuid.uuid,
            updatedDate: event.updatedAt,
            uuid: event.checkoutUuid.uuid,
        })
        await this.chekcoutReadRepository.save(checkoutQueryModel)
        
        await this.idempotentMessageRepository.setMessageId(event.id)
    }
    @EventPattern("checkout_cancelled")
    async handleCheckoutCancelledEvent(@Payload() event:any){
        if(await this.idempotentMessageRepository.isMessageExist(event.id)){
            console.log("This message allready computed")
            return
        }
        await this.chekcoutReadRepository.updateStateByUuid(event.checkoutUuid.uuid, event.newCheckoutState)
        
        await this.idempotentMessageRepository.setMessageId(event.id)
    }

    @EventPattern("an_item_added")
    async handleAnCheckoutItemAdded(@Payload() event: any){
        if(await this.idempotentMessageRepository.isMessageExist(event.id)){
            console.log("This message allready computed")
            return
        }

        let checkoutItemFromRepo = await this.chekcoutReadRepository.findOneCheckoutItemByUuid(event.itemEntityUuid.uuid)

        if(checkoutItemFromRepo.isNull()){
            const checkoutItem = CheckoutItemQueryModel.valueOf({
                checkoutUuid: event.checkoutUuid.uuid,
                createdDate: event.createdAt,
                productBasePrice: event.productBasePrice.amount,
                productHeader: event.productHeader.header,
                productQuantity: event.productQuantity.quantity,
                productUuid: event.productUuid.uuid,
                updatedDate: event.updatedAt,
                uuid: event.itemEntityUuid.uuid
            })
            await this.chekcoutReadRepository.saveCheckoutItem(checkoutItem)
            return
        }
        await this.chekcoutReadRepository.updateCheckoutItemQuantityByUuid(event.itemEntityUuid.uuid, event.productQuantity.quantity)
        
        await this.idempotentMessageRepository.setMessageId(event.id)
    }

    @EventPattern("item-quantity-increased")
    async handleItemQuantityIncreased(@Payload() event:any){
        if(await this.idempotentMessageRepository.isMessageExist(event.id)){
            console.log("This message allready computed")
            return
        }

        await this.chekcoutReadRepository.updateCheckoutItemQuantityByUuid(event.checkoutItemUuid.uuid, event.itemQuantity.quantity)
        
        await this.idempotentMessageRepository.setMessageId(event.id)

    }

    @EventPattern("an-item-deleted")
    async handleAnItemDeleted(@Payload() event:any) {
        if(await this.idempotentMessageRepository.isMessageExist(event.id)){
            console.log("This message allready computed")
            return
        }

        await this.chekcoutReadRepository.updateCheckoutItemQuantityByUuid(event.checkoutItemUuid.uuid, event.quantity.quantity)
        
        await this.idempotentMessageRepository.setMessageId(event.id)

    }
    
    @EventPattern("item-deleted")
    async handleItemDeleted(@Payload() event:any){
        if(await this.idempotentMessageRepository.isMessageExist(event.id)){
            console.log("This message allready computed")
            return
        }

        await this.chekcoutReadRepository.deleteCheckoutItemByUuid(event.checkoutItemUuid.uuid)        
        await this.idempotentMessageRepository.setMessageId(event.id)

    }

    @EventPattern("item-quantity-decreased")
    async handleItemQuantityDecreased(@Payload() event:any){
        if(await this.idempotentMessageRepository.isMessageExist(event.id)){
            console.log("This message allready computed")
            return
        }

        await this.chekcoutReadRepository.updateCheckoutItemQuantityByUuid(event.checkoutItemUuid.uuid, event.quantity.quantity)
        
        await this.idempotentMessageRepository.setMessageId(event.id)
    }

    @EventPattern("checkout-completed")
    async checkoutCompleted(@Payload() event:any) {
        if(await this.idempotentMessageRepository.isMessageExist(event.id)){
            console.log("This message allready computed")
            return
        }

        await this.chekcoutReadRepository.updateStateByUuid(event.checkoutUuid, event.state)

        await this.idempotentMessageRepository.setMessageId(event.id) 
    }
}