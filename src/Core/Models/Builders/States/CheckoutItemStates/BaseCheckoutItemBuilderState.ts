import CheckoutItemBuilder from '../../CheckoutItemBuilder';
import CheckoutItemInterface from '../../../Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import ProductID from '../../../ValueObjects/ProductID';
import ProductHeader from '../../../ValueObjects/ProductHeader';
import Money from '../../../ValueObjects/Money';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
import CheckoutID from '../../../ValueObjects/CheckoutID';
export default abstract class BaseCheckoutItemBuilderState {
    protected context: CheckoutItemBuilder;

    setContext(ctx: CheckoutItemBuilder) {
        this.context = ctx
    }
    abstract checkoutUuid(uuid: () => CheckoutID):void
    abstract checkoutItemUuid(itemUuid: () => CheckoutItemID):void
    abstract checkoutProductUuid(productUuid:() => ProductID):void
    abstract checkoutProductHeader(itemHeader: () => ProductHeader):void
    abstract checkoutProductBasePrice(itemBasePrice: () => Money):void
    abstract checkoutProductQuantity(itemQuantity: () => ProductQuantity):void
    abstract checkoutCreatedAt(date:Date):void
    abstract checkoutUpdatedAt(date:Date):void
    abstract build():CheckoutItemInterface
}