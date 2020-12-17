import { authenticate } from '@loopback/authentication';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param,


  patch,


  requestBody
} from '@loopback/rest';
import {Userevent} from '../models';
import {UsereventRepository} from '../repositories';

export class UsereventController {
  constructor(
    @repository(UsereventRepository)
    public usereventRepository: UsereventRepository,
  ) {}

  @get('/userevents', {
    responses: {
      '200': {
        description: 'Array of Userevent model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Userevent, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Userevent) filter?: Filter<Userevent>,
  ): Promise<Userevent[]> {
    return this.usereventRepository.find(filter);
  }

  @get('/userevents/{id}', {
    responses: {
      '200': {
        description: 'Userevent model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Userevent, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Userevent, {exclude: 'where'}) filter?: FilterExcludingWhere<Userevent>
  ): Promise<Userevent> {
    return this.usereventRepository.findById(id, filter);
  }

  @patch('/userevents/{id}', {
    responses: {
      '204': {
        description: 'Userevent PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userevent, {partial: true}),
        },
      },
    })
    userevent: Userevent,
  ): Promise<void> {
    await this.usereventRepository.updateById(id, userevent);
  }
}
