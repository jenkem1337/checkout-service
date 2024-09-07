import MutationalCheckoutReadRepository from './MutationalCheckoutReadRepository';
import QueryableCheckoutReadRepository from './QueryableCheckoutReadRepository';
export default interface ReadCheckoutRepository extends 
                                    MutationalCheckoutReadRepository,
                                    QueryableCheckoutReadRepository{}