// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
// Custom para ejemplo con useritem

import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {Userevent} from './models';
import {Credentials} from './repositories';
import {PasswordHasher} from './services/hash.password.bcryptjs';

export namespace PasswordHasherBindings {
  //https://loopback.io/doc/en/lb4/apidocs.context.bindingkey.create.html
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'control.password.hash',
  );
  export const ROUNDS = BindingKey.create<number>('cantidad.password.round');
}

export namespace UserServiceBindings {
  //https://loopback.io/doc/en/lb4/apidocs.context.bindingkey.create.html
  export const USER_SERVICE = BindingKey.create<
    UserService<Userevent, Credentials>
  >('services.user.service');

  export const DATASOURCE_NAME = '';
}

export namespace CustomAuthorizeProvider {
  export const AUTHORIZE_PROVIDER = 'authorizationProviders.my-authorizer-provider';
}
