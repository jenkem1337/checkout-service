import Address from "../../Core/Models/ValueObjects/Address"
import ChracterDoesntMatchException from '../../Core/Exceptions/CharacterDoesntMatchException';
import NullPropertyException from "../../Core/Exceptions/NullPropertyException";

describe('Address', () => {
    describe('Address Constructor', () => {
        it('should return true when given all property valid', () => {
            let address = Address.notNullableConstruct('home', 'John', 'Doe', 'John Doe 4455 Landing Lange, APT 4 Louisville, KY 40018-1234', 'USA', 'Kentucky', 'Louisville', '40018-1234')
            expect(address).toBeTruthy()
        })
        it('should throw ChracterDoesntMatchException when given blank name', () => {
            expect(() => Address.notNullableConstruct('home', '     ', 'Doe', 'John Doe 4455 Landing Lange, APT 4 Louisville, KY 40018-1234', 'USA', 'Kentucky', 'Louisville', '40018-1234'))
                    .toThrow(ChracterDoesntMatchException)
        })
        it('should throw ChracterDoesntMatchException when given blank surname', () => {
            expect(() => Address.notNullableConstruct('home', 'John', '          ', 'John Doe 4455 Landing Lange, APT 4 Louisville, KY 40018-1234', 'USA', 'Kentucky', 'Louisville', '40018-1234'))
            .toThrow(ChracterDoesntMatchException)
        })
        it('should throw ChracterDoesntMatchException when given blank name and surname', () => {
            expect(() => Address.notNullableConstruct('home', '         ', '          ', 'John Doe 4455 Landing Lange, APT 4 Louisville, KY 40018-1234', 'USA', 'Kentucky', 'Louisville', '40018-1234'))
            .toThrow(ChracterDoesntMatchException)
        })
        it('should throw NullPropertyException when null or empty given to any property', () => {
            expect(() => Address.notNullableConstruct('', 'John', 'Doe', 'John Doe 4455 Landing Lange, APT 4 Louisville, KY 40018-1234', 'USA', 'Kentucky', 'Louisville', '40018-1234'))
            .toThrow(NullPropertyException)

            expect(() => Address.notNullableConstruct('home', 'John', 'Doe', null, 'USA', 'Kentucky', 'Louisville', '40018-1234'))
            .toThrow(NullPropertyException)
        })

    })
    describe('Address Methods', ()=>{
        describe('Address::equals', () => {
            it('should return true when given same instance', () =>{
                let address =  Address.notNullableConstruct('home', 'John', 'Doe', 'John Doe 4455 Landing Lange, APT 4 Louisville, KY 40018-1234', 'USA', 'Kentucky', 'Louisville', '40018-1234')
                expect(address.equals(address)).toBe(true)
            })
            it('should return false when given null', () => {
                let address =  Address.notNullableConstruct('home', 'John', 'Doe', 'John Doe 4455 Landing Lange, APT 4 Louisville, KY 40018-1234', 'USA', 'Kentucky', 'Louisville', '40018-1234')
                expect(address.equals(null)).toBe(false)
            })
            it('should return false when given differant instance with differant property', () => {
                let address =  Address.notNullableConstruct('home', 'John', 'Doe', 'John Doe 4455 Landing Lange, APT 4 Louisville, KY 40018-1234', 'USA', 'Kentucky', 'Louisville', '40018-1234')
                let address2 =  Address.notNullableConstruct('ev', 'Ali', 'Pembe', 'Küçükbakkalköy, Tekiner Sk 7-1, 34750 Dudullu Osb/Ataşehir/İstanbul', 'Türkiye', 'İstanbul', 'Ataşehir', '34750')
                expect(address.equals(address2)).toBe(false)
            })
            it('should return true when given differant instance with same property', () => {
                let address =  Address.notNullableConstruct('ev', 'Ali', 'Pembe', 'Küçükbakkalköy, Tekiner Sk 7-1, 34750 Dudullu Osb/Ataşehir/İstanbul', 'Türkiye', 'İstanbul', 'Ataşehir', '34750')
                let address2 =  Address.notNullableConstruct('ev', 'Ali', 'Pembe', 'Küçükbakkalköy, Tekiner Sk 7-1, 34750 Dudullu Osb/Ataşehir/İstanbul', 'Türkiye', 'İstanbul', 'Ataşehir', '34750')
                expect(address.equals(address2)).toBe(true)

            })
        })
    })
})