import ProductQuantity from '../../Core/Models/ValueObjects/ProductQuantity';
describe('ProductQuantity', () => {
    describe('ProductQuantity Constructor', () => {
        it('should return true when given valid property', () => {
            expect(() => new ProductQuantity(15)).toBeTruthy()
        })
        it('should return zero when given negative number', () =>{
            let productQuantity =new ProductQuantity(-9)
            expect(productQuantity.getQuantity()).toBe(0)
        })
    })

    describe('ProductQuantity Methods', () => {
        describe('ProductQuantity::incrementQuantity', () => {
            it('should return 20 when given ProductQuantity instance with 13 and increment with 7', () => {
                const productQuantity = new ProductQuantity(13)
                const newProductInstance = productQuantity.incrementQuantity(7)
                expect(newProductInstance.getQuantity()).toBe(20)
            })

            it('should return 20 when given ProductQuantity instance with 13 and increment with -7', () => {
                const productQuantity = new ProductQuantity(13)
                const newProductInstance = productQuantity.incrementQuantity(-7)
                expect(newProductInstance.getQuantity()).toBe(20)
            })
        })
        describe('ProductQuantity::decrementQuantity', () => {
            it('should return 6 when given ProductQuantity instance with 13 and decrement with 7', () => {
                const productQuantity = new ProductQuantity(13)
                const newProductInstance = productQuantity.decrementQuantity(7)
                expect(newProductInstance.getQuantity()).toBe(6)
            })

            it('should return 6 when given ProductQuantity instance with 13 and decrement with -7', () => {
                const productQuantity = new ProductQuantity(13)
                const newProductInstance = productQuantity.decrementQuantity(-7)
                expect(newProductInstance.getQuantity()).toBe(6)
            })

            it('should return zero when given making negative number for amount', () => {
                let productQuantity = new ProductQuantity(13)
                let _productQuantity = productQuantity.decrementQuantity(15)
                expect(_productQuantity.getQuantity()).toBe(0)
            })
        })
    })
})
