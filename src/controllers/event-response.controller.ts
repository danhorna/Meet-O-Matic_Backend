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
  Event,
  Response,
} from '../models';
import {EventRepository} from '../repositories';

export class EventResponseController {
  constructor(
    @repository(EventRepository) protected eventRepository: EventRepository,
  ) { }

  @get('/events/{id}/responses', {
    responses: {
      '200': {
        description: 'Array of Event has many Response',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Response)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Response>,
  ): Promise<Response[]> {
    return this.eventRepository.responses(id).find(filter);
  }

  @post('/events/{id}/responses', {
    responses: {
      '200': {
        description: 'Event model instance',
        content: {'application/json': {schema: getModelSchemaRef(Response)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Event.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Response, {
            title: 'NewResponseInEvent',
            exclude: ['id'],
            optional: ['eventId']
          }),
        },
      },
    }) response: Omit<Response, 'id'>,
  ): Promise<Response> {
    return this.eventRepository.responses(id).create(response);
  }

  // @patch('/events/{id}/responses', {
  //   responses: {
  //     '200': {
  //       description: 'Event.Response PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async patch(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Response, {partial: true}),
  //       },
  //     },
  //   })
  //   response: Partial<Response>,
  //   @param.query.object('where', getWhereSchemaFor(Response)) where?: Where<Response>,
  // ): Promise<Count> {
  //   return this.eventRepository.responses(id).patch(response, where);
  // }

  // @del('/events/{id}/responses', {
  //   responses: {
  //     '200': {
  //       description: 'Event.Response DELETE success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async delete(
  //   @param.path.string('id') id: string,
  //   @param.query.object('where', getWhereSchemaFor(Response)) where?: Where<Response>,
  // ): Promise<Count> {
  //   return this.eventRepository.responses(id).delete(where);
  // }
}
