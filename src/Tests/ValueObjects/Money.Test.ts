import Money from '../../Core/Models/ValueObjects/Money'
import NegativeNumberException from '../../Core/Exceptions/NegativeNumberException';
describe('Money',() => {
    describe('Money Constructor', () => {
        it('should return true when given valid property', () => {
            expect(() => new Money(11)).toBeTruthy()
        })
        it('should return true when given zero to constructor', () => {
            expect(() => new Money(0)).toBeTruthy()
        })
        it('should throw NegativeNumberException when given negative number', () => {
            expect(() => new Money(-12.99)).toThrow(NegativeNumberException)
        })
    })
    describe('Money Methods', () => {
        describe('Money::plus', () => {
            it('should return true when given valid property and not negative number', () =>{
                let money = new Money(12)
                let newMoney = money.plus(32)
                expect(newMoney).toBeTruthy()
            })
            it('should return 99 when given Money instance with 45 and sum with 54', () => {
                let money = new Money(45)
                let newMoney = money.plus(54)
                expect(newMoney.getAmount()).toBe(99)
            })
            it('should return 99 when given Money instance with 45 and sum with -54', () => {
                let money = new Money(45)
                let newMoney = money.plus(-54)
                expect(newMoney.getAmount()).toBe(99)
            })
        })

        describe('Money::subtract', () => {
            it('should return true when given valid property and not negative number', () => {
                let money = new Money(12)
                let newMoney = money.subtract(12)
                expect(newMoney).toBeTruthy()
            })
            it('should throw NegativeNumberException when given making negative amount for Money constructor', () => {
                try {
                    let money = new Money(12)
                    let newMoney = money.subtract(50)
                } catch (err:any) {
                    expect(err.message).toBe('number must be greater than zero')
                }
            })

            it('should return 1 when given Money instance with 21 and subtract with 20', () => {
                let money = new Money(21)
                let newMoney = money.subtract(20)
                expect(newMoney.getAmount()).toBe(1)
            })
            it('should return 1 when given Money instance with 21 and subtract with -20', () => {
                let money = new Money(21)
                let newMoney = money.subtract(-20)
                expect(newMoney.getAmount()).toBe(1)
            })

        })

        describe('Money::times', () => {
            it('should return true when given valid property and not negative number', () => {
                let money = new Money(12)
                let newMoney = money.times(12)
                expect(newMoney).toBeTruthy()
            })
            it('should return 100 when given Money instance with 10 and times 10', () =>{
                let money = new Money(10)
                let newMoney = money.times(10)
                expect(newMoney.getAmount()).toBe(100)

            })
        })
    })
})