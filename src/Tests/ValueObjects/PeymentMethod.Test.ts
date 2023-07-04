import PeymentMethod from '../../Core/Models/ValueObjects/PeymentMethod';
import NullPropertyException from '../../Core/Exceptions/NullPropertyException';
import ChracterDoesntMatchException from '../../Core/Exceptions/CharacterDoesntMatchException';
describe('PeymentMethod', () => {
    describe('PeymentMethod Constructor', () => {
        it('should true when given valid property', () =>{
            expect(() => PeymentMethod.notNullableConstruct('Credit-Cart')).toBeTruthy()
        })
        it('should throw NullPropertyException when empty string', () =>{
            expect(() => PeymentMethod.notNullableConstruct('')).toThrow(NullPropertyException)
        })
        it('should throw ChracterDoesntMatchException when blank string', () =>{
            expect(() => PeymentMethod.notNullableConstruct('      ')).toThrow(ChracterDoesntMatchException)
        })

    })
})