import {Entity, model, property} from '@loopback/repository';

@model()
export class Response extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  eventId: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  prefdates: object[];

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  message?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<Response>) {
    super(data);
  }
}

export interface ResponseRelations {
  // describe navigational properties here
}

export type ResponseWithRelations = Response & ResponseRelations;
