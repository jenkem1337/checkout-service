import { Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import CheckoutItemDataMapper from './CheckoutItemDataMapper';

@Entity({name: 'checkouts'})
export default class CheckoutDataMapper {
    
    @PrimaryColumn({name:"uuid"})
    public uuid: string

    @Column({name: "customer_uuid"})
    public customerUuid:string

    @Column({name:"state"})
    public checkoutState:string

    @CreateDateColumn({name: "created_at"})
    public createdDate: Date

    @UpdateDateColumn({name: "updated_at"})
    public updatedDate:Date
    
    @OneToMany(() => CheckoutItemDataMapper, checkoutItem => checkoutItem.checkout, {
        cascade: true
    })
    public checkoutItems: CheckoutItemDataMapper[]

    constructor(uuid?:string, customerUuid?:string, checkoutState?:string, checkoutItems?:CheckoutItemDataMapper[]) {
        this.uuid = uuid
        this.customerUuid = customerUuid
        this.checkoutState = checkoutState
        this.checkoutItems = checkoutItems
    }

    static createNull() {
        return new CheckoutDataMapper(null, null, null, [CheckoutItemDataMapper.createNull()])
    }
}