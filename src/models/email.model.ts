import {Entity, model, property} from '@loopback/repository';

@model()
export class Email extends Entity {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  recipients: string[];

  @property({
    type: 'string',
    required: true,
  })
  eventurl: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<Email>) {
    super(data);
  }
}

export interface EmailRelations {
  // describe navigational properties here
}

export type EmailWithRelations = Email & EmailRelations;
