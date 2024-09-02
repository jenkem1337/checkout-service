import CheckoutState from '../../Core/Models/ValueObjects/CheckoutState';
import { CheckoutStates } from '../../Core/Models/ValueObjects/CheckoutState';
import NullPropertyException from '../../Core/Exceptions/NullPropertyException';
describe('CheckoutState', () => {
    describe('CheckoutState Constructor', () => {
        it('should return true when given property is valid', () => {
            expect(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED)).toBeTruthy()
        })
        it('Should throw NullPropertyException when given null property', ()=>{
            expect(() => new CheckoutState(null)).toThrow(NullPropertyException)
        })
    })
    describe('CheckoutState Method(s)', () => {
        describe('CheckoutState::getState', () => {
            it('should return CHECKOUT_CREATED when given CheckoutStates.CHECKOUT_CREATED to constructor', ( )=> {
                let expectedValue = "CHECKOUT_CREATED"
                const checkoutState = new CheckoutState(CheckoutStates.CHECKOUT_CREATED)
                expect(checkoutState.getState()).toBe(expectedValue)
            })
            it('should return CHECKOUT_COMPLETED when given CheckoutStates.CHECKOUT_COMPLETED to constructor', ( )=> {
                let expectedValue = "CHECKOUT_COMPLETED"
                const checkoutState = new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED)
                expect(checkoutState.getState()).toBe(expectedValue)
            })
            it('should return CHECKOUT_CANCELLED when given CheckoutStates.CHECKOUT_CANCELLED to constructor', ( )=> {
                let expectedValue = "CHECKOUT_CANCELLED"
                const checkoutState = new CheckoutState(CheckoutStates.CHECKOUT_CANCELLED)
                expect(checkoutState.getState()).toBe(expectedValue)
            })

        })
    })
})