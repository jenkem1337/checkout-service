import { Injectable } from '@nestjs/common';
import { ICommand, Saga } from "@nestjs/cqrs";
import {Observable, map} from 'rxjs'
import { ofType } from '@nestjs/cqrs';
import CreateNewCheckoutAndAddNewCheckoutItemCommand from '../Commands/Command/CreateNewCheckoutAndAddNewCheckoutItemCommand';
import CheckoutCreatedAndOneCheckoutItemAddedEvent from '../Events/CheckoutCreatedAndOneCheckoutItemAddedEvent';

@Injectable()
export class CheckoutSagas {
}
