import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Userevent,
  Event,
} from '../models';
import {UsereventRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { checkAuthorization } from '../services/checkauthorization';

@authenticate('jwt')
@authorize({
  allowedRoles: ['normal'],
  voters: [checkAuthorization]
})
export class UsereventEventController {
  constructor(
    @repository(UsereventRepository) protected usereventRepository: UsereventRepository,
  ) { }

  @get('/userevents/{id}/events', {
    responses: {
      '200': {
        description: 'Array of Userevent has many Event',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Event)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Event>,
  ): Promise<Event[]> {
    return this.usereventRepository.events(id).find(filter);
  }

  @post('/userevents/{id}/events', {
    responses: {
      '200': {
        description: 'Userevent model instance',
        content: {'application/json': {schema: getModelSchemaRef(Event)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Userevent.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {
            title: 'NewEventInUserevent',
            exclude: ['id'],
            optional: ['usereventId']
          }),
        },
      },
    }) event: Omit<Event, 'id'>,
  ): Promise<Event> {
    return this.usereventRepository.events(id).create(event);
  }

  @patch('/userevents/{id}/events', {
    responses: {
      '200': {
        description: 'Userevent.Event PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {partial: true}),
        },
      },
    })
    event: Partial<Event>,
    @param.query.object('where', getWhereSchemaFor(Event)) where?: Where<Event>,
  ): Promise<Count> {
    return this.usereventRepository.events(id).patch(event, where);
  }

  @del('/userevents/{id}/events', {
    responses: {
      '200': {
        description: 'Userevent.Event DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Event)) where?: Where<Event>,
  ): Promise<Count> {
    return this.usereventRepository.events(id).delete(where);
  }
}
