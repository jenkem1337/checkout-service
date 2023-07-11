import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import Result from '../../../../Core/Models/Result/Result';
import { Inject } from "@nestjs/common";
import QueryableCheckoutReadRepository from '../../../../Core/Interfaces/QueryableCheckoutReadRepository';
import SuccessResult from '../../../../Core/Models/Result/SuccsessResult';
import CheckoutByUuidAndCustomerUuidQuery from "../Query/CheckoutByUuidAndCustomerUuidQuery";
import QueryModel from '../../../Models/QueryModels/QueryModel';
import { HandleException } from "../HandleExceptionDecorator";
import CheckoutNotFound from '../../../Exceptions/CheckoutNotFound';

@QueryHandler(CheckoutByUuidAndCustomerUuidQuery)
export default class FindCheckoutByUuidAndCustomerUuidQueryHandler implements IQueryHandler<CheckoutByUuidAndCustomerUuidQuery, Result<QueryModel>> {
    constructor(
        @Inject("CheckoutReadRepository")
        private readonly checkoutReadRepository:QueryableCheckoutReadRepository
    ){}
    
    @HandleException
    async execute(query: CheckoutByUuidAndCustomerUuidQuery): Promise<Result<QueryModel>> {
        const checkoutQueryModel = await this.checkoutReadRepository.findOneByUuidAndCustomerUuid(query.checkoutUuid, query.customerUuid)
        if(checkoutQueryModel.isNull()) {
            throw new CheckoutNotFound()
        }
        return new SuccessResult(checkoutQueryModel)
    }

}