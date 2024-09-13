import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import CheckoutDataMapper from './CheckoutDataMapper';

@Entity({name: 'checkout_items'})
export default class CheckoutItemDataMapper {
    
    @PrimaryColumn()
    public uuid:string
    
    @Column({name: "base_price"})
    public productBasePrice:number
    
    @Column({name: "quantity"})
    public productQuantity: number
    
    @Column({name:"header"})
    public productHeader:string
    
    @Column({name: "product_uuid"})
    public productUuid: string

    @CreateDateColumn({name:"created_at"})
    public createdDate: Date
    
    @UpdateDateColumn({name: "updated_at"})
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
    static createNull(){
        return new CheckoutItemDataMapper(null, null, null, null, null, null)
    }
}