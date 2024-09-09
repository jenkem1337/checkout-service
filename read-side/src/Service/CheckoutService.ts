import FindAnCheckoutDto from '../Controller/DTO/FindAnCheckoutDto';
export default interface CheckoutService {
    findAnCheckoutByUuidAndCustomerUuid(findAnCheckoutDto:FindAnCheckoutDto)
}