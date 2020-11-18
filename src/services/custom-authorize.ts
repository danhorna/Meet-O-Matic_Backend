import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {Provider} from '@loopback/core';

export class Customauthorize implements Provider<Authorizer> {
  constructor() {}

  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    const clientRole = authorizationCtx.principals[0].roles;
    const allowedRoles = metadata.allowedRoles;
    return allowedRoles!.includes(clientRole[0])
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
