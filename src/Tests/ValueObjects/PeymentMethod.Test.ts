import PeymentMethod from '../../Core/Models/ValueObjects/PeymentMethod';
import NullPropertyException from '../../Core/Exceptions/NullPropertyException';
import ChracterDoesntMatchException from '../../Core/Exceptions/CharacterDoesntMatchException';
describe('PeymentMethod', () => {
    describe('PeymentMethod Constructor', () => {
        it('should true when given valid property', () =>{
            expect(() => new PeymentMethod('Credit-Cart')).toBeTruthy()
        })
        it('should throw NullPropertyException when empty string', () =>{
            expect(() => new PeymentMethod('')).toThrow(NullPropertyException)
        })
        it('should throw ChracterDoesntMatchException when blank string', () =>{
            expect(() => new PeymentMethod('      ')).toThrow(ChracterDoesntMatchException)
        })

    })
})