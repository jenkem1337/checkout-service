import { Module } from "@nestjs/common";
import DomainModelFactoryContext, { IDomainModelFactoryContext } from '../../Core/Models/Factories/DomainModelFactoryContext';
import NullableCheckoutItemFactory from '../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import NullableCheckoutFactory from '../../Core/Models/Factories/Checkout/NullableCheckoutFactory';
import ConcreteCheckoutFactory from '../../Core/Models/Factories/Checkout/ConcreteCheckoutFactory';
import ConcreateCheckoutItemFactory from '../../Core/Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import ConcreateAllArgumentCheckoutFactory from '../../Core/Models/Factories/Checkout/ConcreateAllArgumentCheckoutFactory';
import NullableAllArgumentCheckoutFactory from '../../Core/Models/Factories/Checkout/NullableAllArgumentCheckoutFactory';
import CreateCheckoutWithCheckoutCreatedEventFactory from "../../Core/Models/Factories/Checkout/CreateCheckoutWithCheckoutCreatedEventFactory";

@Module({
    providers: [{
        provide:"DomainModelFactoryContext",
        useFactory: () => {
            const factoryCtx: IDomainModelFactoryContext = new DomainModelFactoryContext()
            
            factoryCtx.addFactoryClass(NullableCheckoutFactory.name, new NullableCheckoutFactory())
                    .addFactoryClass(ConcreteCheckoutFactory.name, new ConcreteCheckoutFactory())
                    .addFactoryClass(ConcreateCheckoutItemFactory.name, new ConcreateCheckoutItemFactory())
                    .addFactoryClass(NullableCheckoutItemFactory.name, new NullableCheckoutItemFactory())
                    .addFactoryClass(ConcreateAllArgumentCheckoutFactory.name, new ConcreateAllArgumentCheckoutFactory())
                    .addFactoryClass(NullableAllArgumentCheckoutFactory.name, new NullableAllArgumentCheckoutFactory())
                    .addFactoryClass(CreateCheckoutWithCheckoutCreatedEventFactory.name, new CreateCheckoutWithCheckoutCreatedEventFactory())

            return factoryCtx
        }
    }],
    exports: ["DomainModelFactoryContext"] 
})
export default class DomainModelFactoryModule {}