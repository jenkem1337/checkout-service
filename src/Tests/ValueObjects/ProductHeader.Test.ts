import ProductHeader from '../../Core/Models/ValueObjects/ProductHeader';
import NullPropertyException from '../../Core/Exceptions/NullPropertyException';
import ChracterDoesntMatchException from '../../Core/Exceptions/CharacterDoesntMatchException';
describe('ProductHeader', () => {
    describe('ProductHeader Constructor', () => {
        it('should return true when given all property valid',() => {
            expect(() => new ProductHeader('BMW 3.20i 2010')).toBeTruthy()
        })
        it('should throw NullPropertyException when given null or empty string to property', () => {
            expect(() => new ProductHeader(null)).toThrow(NullPropertyException)
            expect(() => new ProductHeader('')).toThrow(NullPropertyException)
        })
        it('should throw ChracterDoesntMatchException when given blank string', () => {
            expect(() => new ProductHeader('        ')).toThrow(ChracterDoesntMatchException)
        })
    })  
})