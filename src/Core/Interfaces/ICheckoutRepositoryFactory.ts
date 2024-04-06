import CheckoutRepository from "./CheckoutRepository";

export default interface ICheckoutRepositoryFactory {
    createCheckoutRepository():CheckoutRepository
}