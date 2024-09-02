import { Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import CheckoutItemDataMapper from './CheckoutItemDataMapper';

@Entity({name: 'checkouts'})
export default class CheckoutDataMapper {
    
    @PrimaryColumn()
    public uuid: string

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

    @CreateDateColumn()
    public createdDate: Date

    @UpdateDateColumn()
    public updatedDate:Date
    
    @OneToMany(() => CheckoutItemDataMapper, checkoutItem => checkoutItem.checkout, {
        cascade: true
    })
    public checkoutItems: CheckoutItemDataMapper[]

    constructor(uuid?:string, customerUuid?:string, subTotal?:number, shippingPrice?:number, peymentMethod?:string, checkoutState?:string, checkoutItems?:CheckoutItemDataMapper[]) {
        this.uuid = uuid
        this.customerUuid = customerUuid
        this.subTotal = subTotal
        this.shippingPrice = shippingPrice
        this.peymentMethod = peymentMethod
        this.checkoutState = checkoutState
        this.checkoutItems = checkoutItems
    }

    static createNull() {
        return new CheckoutDataMapper(null, null, null, null, null, null, [CheckoutItemDataMapper.createNull()])
    }
}