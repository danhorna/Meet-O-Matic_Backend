import {DefaultCrudRepository} from '@loopback/repository';
import {Response, ResponseRelations} from '../models';
import {MongodbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ResponseRepository extends DefaultCrudRepository<
  Response,
  typeof Response.prototype.id,
  ResponseRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Response, dataSource);
  }
}
