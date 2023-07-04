import Repository from './Repository';
import Checkout from '../Models/Domain Models/Checkout/Checkout';
import CheckoutInterface from '../Models/Domain Models/Checkout/CheckoutInterface';
export default interface ReadCheckoutRepository extends Repository<Promise<CheckoutInterface>, Promise<CheckoutInterface[]>, Checkout>{
    updateCheckoutItemDocument(checkout:Checkout): Promise<void>
    findOneByUuidAndCustomerUuid(uuid:string, customerUuid:string): Promise<CheckoutInterface>
    findManyByCustomerUuid(custormerUuid:string): Promise<CheckoutInterface[]>

}