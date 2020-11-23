import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Event} from './event.model';
import {UserCredentials} from './user-credentials.model';

@model()
export class Userevent extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  premium?: boolean;

  @hasMany(() => Event)
  events: Event[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<Userevent>) {
    super(data);
  }
}

export interface UsereventRelations {
  // describe navigational properties here
}

export type UsereventWithRelations = Userevent & UsereventRelations;
