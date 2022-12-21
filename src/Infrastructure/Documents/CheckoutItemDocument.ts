import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export default class CheckoutItemDocument {
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

    constructor(uuid:string, productBasePrice:number, productQuantity:number, productHeader:string, productUuid:string, createdDate:Date, updatedDate:Date){
        this.uuid = uuid
        this.productBasePrice = productBasePrice
        this.productHeader = productHeader
        this.productQuantity = productQuantity
        this.productUuid = productUuid
        this.createdDate = createdDate
        this.updatedDate = updatedDate
    }

}