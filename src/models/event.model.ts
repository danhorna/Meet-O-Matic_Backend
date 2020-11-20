import {Entity, hasMany, model, property} from '@loopback/repository';
import {Response} from './response.model';

@model()
export class Event extends Entity {
  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  dates: object[];

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  usereventId?: string;

  @property({
    type: 'string',
    required: true,
  })
  creationDate: string;

  @hasMany(() => Response)
  responses: Response[];

  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export interface EventRelations {
  // describe navigational properties here
}

export type EventWithRelations = Event & EventRelations;
