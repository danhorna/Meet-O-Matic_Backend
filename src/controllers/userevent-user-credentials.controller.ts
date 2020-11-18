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
  UserCredentials,
} from '../models';
import {UsereventRepository} from '../repositories';

export class UsereventUserCredentialsController {
  constructor(
    @repository(UsereventRepository) protected usereventRepository: UsereventRepository,
  ) { }

  @get('/userevents/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'Userevent has one UserCredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCredentials),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserCredentials>,
  ): Promise<UserCredentials> {
    return this.usereventRepository.userCredentials(id).get(filter);
  }

  @post('/userevents/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'Userevent model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCredentials)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Userevent.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {
            title: 'NewUserCredentialsInUserevent',
            exclude: ['id'],
            optional: ['usereventId']
          }),
        },
      },
    }) userCredentials: Omit<UserCredentials, 'id'>,
  ): Promise<UserCredentials> {
    return this.usereventRepository.userCredentials(id).create(userCredentials);
  }

  @patch('/userevents/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'Userevent.UserCredentials PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {partial: true}),
        },
      },
    })
    userCredentials: Partial<UserCredentials>,
    @param.query.object('where', getWhereSchemaFor(UserCredentials)) where?: Where<UserCredentials>,
  ): Promise<Count> {
    return this.usereventRepository.userCredentials(id).patch(userCredentials, where);
  }

  @del('/userevents/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'Userevent.UserCredentials DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCredentials)) where?: Where<UserCredentials>,
  ): Promise<Count> {
    return this.usereventRepository.userCredentials(id).delete(where);
  }
}
