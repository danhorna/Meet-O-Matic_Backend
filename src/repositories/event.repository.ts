import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Event, EventRelations, Response} from '../models';
import {MongodbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ResponseRepository} from './response.repository';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
> {

  public readonly responses: HasManyRepositoryFactory<Response, typeof Event.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ResponseRepository') protected responseRepositoryGetter: Getter<ResponseRepository>,
  ) {
    super(Event, dataSource);
    this.responses = this.createHasManyRepositoryFactoryFor('responses', responseRepositoryGetter,);
    this.registerInclusionResolver('responses', this.responses.inclusionResolver);
  }
}
