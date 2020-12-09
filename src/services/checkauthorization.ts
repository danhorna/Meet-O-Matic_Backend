// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
//custom para items pruebas

import {
    AuthorizationContext,
    AuthorizationDecision,
    AuthorizationMetadata,
} from '@loopback/authorization';
import { securityId, UserProfile } from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function checkAuthorization(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
    // No access if authorization details are missing
    let currentUser: UserProfile;
    if (authorizationCtx.principals.length > 0) {
        const user = _.pick(authorizationCtx.principals[0], [
            'id',
            'email',
            'roles',
        ]);
        currentUser = { [securityId]: user.id, email: user.email, roles: user.roles };
    } else {
        return AuthorizationDecision.DENY;
    }

    if (!currentUser.roles) {
        return AuthorizationDecision.DENY;
    }

    // Authorize everything that does not have a allowedRoles property
    if (!metadata.allowedRoles) {
        return AuthorizationDecision.ALLOW;
    }

    // Admin permit all
    if (currentUser.roles.includes('admin')) {
        return AuthorizationDecision.ALLOW;
    }

    let roleIsAllowed = false;
    for (const role of currentUser.roles) {
        if (metadata.allowedRoles!.includes(role)) {
            roleIsAllowed = true;
            break;
        }
    }

    if (!roleIsAllowed) {
        return AuthorizationDecision.DENY;
    }

    /**
     * Allow access only to model owners, using route as source of truth
     *
     * eg. @post('/users/{type id|email|other attribute}/orders', ...) returns `userId` as args[0]
     */

    if (currentUser[securityId] === authorizationCtx.invocationContext.args[0]) {
        return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
}
