import { Controller, Inject } from "@nestjs/common";
import {EventPattern} from "@nestjs/microservices"
import CheckoutQueryModel from '../Model/CheckoutQueryModel';
import CheckoutItemQueryModel from '../Model/CheckoutItemQueryModel';
import ReadCheckoutRepository from '../Repository/CheckoutReadRepository';
@Controller()
export default class CheckoutProjection {

    constructor(
        @Inject("CheckoutReadRepository")
        private readonly chekcoutReadRepository: ReadCheckoutRepository
    ){}
    @EventPattern("checkout_created")
    handleCheckoutCreatedEvent(event:any){
        const checkoutQueryModel = CheckoutQueryModel.valueOf({
            checkoutState: event.checkoutState.state,
            createdDate: event.createdAt,
            customerUuid: event.userUuid.uuid,
            subTotal: event.subTotal.amount,
            updatedDate: event.updatedAt,
            uuid: event.checkoutUuid.uuid,
        })
        this.chekcoutReadRepository.save(checkoutQueryModel)
    }
    @EventPattern("checkout_cancelled")
    async handleCheckoutCancelledEvent(event:any){
        this.chekcoutReadRepository.updateStateByUuid(event.checkoutUuid.uuid, event.newCheckoutState)
    }

    @EventPattern("an_item_added")
    async handleAnCheckoutItemAdded(event: any){
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
            this.chekcoutReadRepository.saveCheckoutItem(checkoutItem)
            this.chekcoutReadRepository.updateSubTotalByUuid(event.checkoutUuid.uuid, event.subTotal.amount)
            return
        }
        this.chekcoutReadRepository.updateSubTotalByUuid(event.checkoutUuid.uuid, event.subTotal.amount)
        this.chekcoutReadRepository.updateCheckoutItemQuantityByUuid(event.itemEntityUuid.uuid, event.productQuantity.quantity)
    }

    @EventPattern("item-quantity-increased")
    async handleItemQuantityIncreased(event:any){
        this.chekcoutReadRepository.updateSubTotalByUuid(event.checkoutUuid.uuid, event.subTotal.amount)
        this.chekcoutReadRepository.updateCheckoutItemQuantityByUuid(event.checkoutItemUuid.uuid, event.itemQuantity.quantity)
    }

    @EventPattern("an-item-deleted")
    async handleAnItemDeleted(event:any) {
        this.chekcoutReadRepository.updateCheckoutItemQuantityByUuid(event.checkoutItemUuid.uuid, event.quantity.quantity)
        this.chekcoutReadRepository.updateSubTotalByUuid(event.checkoutUuid.uuid, event.subTotal.amount)
    }
    
    @EventPattern("item-deleted")
    async handleItemDeleted(event:any){
        this.chekcoutReadRepository.deleteCheckoutItemByUuid(event.checkoutItemUuid.uuid)
        this.chekcoutReadRepository.updateSubTotalByUuid(event.checkoutUuid.uuid, event.subTotal.amount)
    }

    @EventPattern("item-quantity-decreased")
    async handleItemQuantityDecreased(event:any){
        this.chekcoutReadRepository.updateCheckoutItemQuantityByUuid(event.checkoutItemUuid.uuid, event.quantity.quantity)
        this.chekcoutReadRepository.updateSubTotalByUuid(event.checkoutUuid.uuid, event.subTotal.amount)

    }
}