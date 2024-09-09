import CheckoutID from '../../Core/Models/ValueObjects/CheckoutID';
import NullIdException from '../../Core/Exceptions/NullIdException';
import WrongUuidException from '../../Core/Exceptions/WrongUuidException';
import { randomUUID } from 'crypto';
describe('CheckoutID', () =>{
    describe('CheckoutID Constructor', () => {
        it('should throw NullIdException due to given null', () => {   
            expect(() => new CheckoutID(null)).toThrow('Id must not be null');
            expect(() => new CheckoutID(null)).toThrow(NullIdException);
        })

        it('should throw WrongUuidException due to invalid uuid', () => {
            expect(() => new CheckoutID('123456789')).toThrow('Wrong uuid');
            expect(() => new CheckoutID('123456789')).toThrow(WrongUuidException);
        })

        it('should be not null when given valid constructor value', ()=>{
            let checkoutID = new CheckoutID(randomUUID());
            expect(checkoutID).toBeTruthy()
        })
    })

    describe('CheckoutID Methods', () => {
        describe('CheckoutID::getUuid', () => {
            
            it('should return uuid when call getUuid method', () => {
                let uuid = randomUUID();
                let checkoutId = new CheckoutID(uuid);
                expect(uuid).toBe(checkoutId.getUuid())
            })
    
        })

        describe('CheckoutID::equals', () => {
            it('should return true when call equals method with same instance', () => {
                let uuid = randomUUID();
                let checkoutId = new CheckoutID(uuid);
                expect(checkoutId.equals(checkoutId)).toBe(true);
            })
            
            it('should return false when given null to equals method', () => {
                let uuid = randomUUID();
                let checkoutId = new CheckoutID(uuid);
                expect(checkoutId.equals(null)).toBe(false);
            })

            it('should true when given same uuid to diffarent instance', () =>{
                let uuid = randomUUID();
                let checkoutId = new CheckoutID(uuid);
                let checkoutId2 = new CheckoutID(uuid);
                expect(checkoutId.equals(checkoutId2)).toBe(true);
            })
            it('should return false when given diffarent uuid to instances', () => {
                let checkoutId = new CheckoutID(randomUUID());
                let checkoutId2 = new CheckoutID(randomUUID());
                expect(checkoutId.equals(checkoutId2)).toBe(false);

            })
        })
    })
})

