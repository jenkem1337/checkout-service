import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import CheckoutItemDocument from './CheckoutItemDocument';

@Entity()
export default class CheckoutDocument {
    @ObjectIdColumn()
    public _id: string
    
    @Column()
    public customerUuid:string

    @Column()
    public subTotal:number

    @Column({default: 0})
    public shippingPrice:number

    @Column({default: null})
    public peymentMethod:string

    @Column()
    public checkoutState:string

    @Column(type => CheckoutItemDocument)
    public checkoutItemDocument: CheckoutItemDocument[]

    @CreateDateColumn()
    public createdDate: Date

    @UpdateDateColumn()
    public updatedDate:Date


    constructor(uuid?:string, customerUuid?:string, subTotal?:number, shippingPrice?:number, peymentMethod?:string, checkoutState?:string, checkoutItemDocument?:CheckoutItemDocument[]) {
        this._id = uuid
        this.customerUuid = customerUuid
        this.subTotal = subTotal
        this.shippingPrice = shippingPrice
        this.peymentMethod = peymentMethod
        this.checkoutState = checkoutState
        this.checkoutItemDocument = checkoutItemDocument
    }

}
