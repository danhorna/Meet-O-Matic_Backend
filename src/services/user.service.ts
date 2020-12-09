// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
//custom para user item
import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {Userevent} from './../models/userevent.model';
import {
  Credentials,
  UsereventRepository,
} from './../repositories/userevent.repository';
import {PasswordHasher} from './hash.password.bcryptjs';

export class MyUserService implements UserService<Userevent, Credentials> {
  constructor(
    @repository(UsereventRepository) public userRepository: UsereventRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Userevent> {
    const {email, password} = credentials;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.userRepository.findOne({
      where: {email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: Userevent): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    let userName = '';
    if (user.name) userName = `${user.name}`;

    //securityId necesario porque extiendde de Principal mismos caso que el CAS
    //en realidad siempre vas a tener un valor de ingreso
    //de lo contrario falla
    const userProfile = {
      [securityId]: String(user.id),
      email: user.email,
      name: userName,
      id: user.id,
      roles: user.roles
    };

    return userProfile;
  }
}
