import { ICommand, IQuery } from '@nestjs/cqrs';
import ErrorResult from '../../../Core/Models/Result/ErrorResult';
import Result from '../../Interfaces/Result';
export function HandleException(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(name: IQuery | ICommand) => Promise<Result<any>>>
){
  
    const originalMethod = descriptor.value!

    descriptor.value = async function(name:IQuery | ICommand): Promise<Result<any>> {
      try {

        return await originalMethod.apply(this, [name])
      } catch (error){
        return new ErrorResult((error as Error).message)
      }
    }
  
}
