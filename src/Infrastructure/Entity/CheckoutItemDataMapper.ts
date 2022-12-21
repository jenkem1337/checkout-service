import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import CheckoutDataMapper from './CheckoutDataMapper';

@Entity({name: 'checkout_items'})
export default class CheckoutItemDataMapper {
    
    @PrimaryColumn()
    public uuid:string
    
    @Column()
    public productBasePrice:number
    
    @Column()
    public productQuantity: number
    
    @Column()
    public productHeader:string
    
    @Column()
    public productUuid: string

    @CreateDateColumn()
    public createdDate: Date
    
    @UpdateDateColumn()
    public updatedDate: Date

    @ManyToOne(() => CheckoutDataMapper, checkout => checkout.checkoutItems)
    public checkout: CheckoutDataMapper

    constructor(uuid:string, productBasePrice:number, productQuantity:number, productHeader:string, productUuid:string, checkout?:CheckoutDataMapper){
        this.uuid = uuid
        this.productBasePrice = productBasePrice
        this.productHeader = productHeader
        this.productQuantity = productQuantity
        this.productUuid = productUuid
        this.checkout = checkout
    }

}