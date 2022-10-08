import CheckoutItemBuilder from '../CheckoutItemBuilder';
import CheckoutItemInterface from '../../Domain Models/CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import ProductID from '../../ValueObjects/ProductID';
import ProductHeader from '../../ValueObjects/ProductHeader';
import Money from '../../ValueObjects/Money';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
export default abstract class BaseCheckoutItemBuilderState {
    protected context: CheckoutItemBuilder;

    setContext(ctx: CheckoutItemBuilder) {
        this.context = ctx
    }
    abstract checkoutUuid(uuid: () => CheckoutItemID):void
    abstract checkoutItemUuid(itemUuid: () => ProductID):void
    abstract checkoutItemHeader(itemHeader: () => ProductHeader):void
    abstract checkoutItemBasePrice(itemBasePrice: () => Money):void
    abstract checkoutItemQuantity(itemQuantity: () => ProductQuantity):void
    abstract checkoutCreatedAt(date:Date):void
    abstract checkoutUpdatedAt(date:Date):void
    abstract build():CheckoutItemInterface
}