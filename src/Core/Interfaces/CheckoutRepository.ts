import Repository from './Repository';
import CheckoutInterface from '../Models/Domain Models/Checkout/CheckoutInterface';
import Checkout from '../Models/Domain Models/Checkout/Checkout';
export default interface CheckoutRepository extends Repository<Promise<CheckoutInterface>, Promise<CheckoutInterface[]>, Checkout>{
    findOneByUuidAndCustomerUuid(uuid:string, customerUuid:string): Promise<CheckoutInterface>
    findManyByUuidAndCustomerUuid(uuid:string, custormerUuid:string): Promise<CheckoutInterface[]>
}