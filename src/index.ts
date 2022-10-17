import * as D from "json-decoder";
import {
  MattermostPermissions,
  mockedRole,
  mockedPolicies,
} from "./mockData.ts";

// @mattermost types
// ----------------
type Role = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  create_at: number;
  update_at: number;
  delete_at: number;
  permissions: string[];
  scheme_managed: boolean;
  built_in: boolean;
};

// types
// -----

// enumeration of possible values for Mapping type
enum MMPermission {
  CREATE_TEAM = "create_team",
  EDIT_OTHERS_POSTS = "edit_others_posts",
  MANAGE_INCOMING_WEBHOOKS = "manage_incoming_webhooks",
  MANAGE_OUTGOING_WEBHOOKS = "manage_outgoing_webhooks",
  MANAGE_SLASH_COMMANDS = "manage_slash_commands",
  MANAGE_OAUTH = "manage_oauth",
}

// Mapping types
// ------------

type MappingKey =
  | "enableTeamCreation"
  | "editOthersPosts"
  | "enableOnlyAdminIntegrations";

type MappingValue = "true" | "false";
type MappingRolename =
  | "team_user"
  | "team_admin"
  | "system_admin"
  | "system_user";

type MappingRole = {
  roleName: MappingRolename;
  permission: MMPermission;
  shouldHave: boolean;
};
type Mapping = {
  enableTeamCreation: { true: MappingRole[]; false: MappingRole[] };
  editOthersPosts: { true: MappingRole[]; false: MappingRole[] };
  enableOnlyAdminIntegrations: { true: MappingRole[]; false: MappingRole[] };
};

type MMPermissions = {
  CREATE_TEAM: string;
  EDIT_OTHERS_POSTS: string;
  MANAGE_INCOMING_WEBHOOKS: string;
  MANAGE_OUTGOING_WEBHOOKS: string;
  MANAGE_SLASH_COMMANDS: string;
  MANAGE_OAUTH: string;
};

// Policy types
// ------------

type Policy = {
  editOthersPosts?: string;
  enableTeamCreation?: string;
  enableOnlyAdminIntegrations?: string;
};

// Role types
// ----------
//
type RoleValue = {
  name: string;
  permissions: string[];
};

type Roles = {
  system_user?: RoleValue;
  system_admin?: RoleValue;
  team_admin?: RoleValue;
  team_user?: RoleValue;
};

// Decoders, to check if JSON object is valid
// -------------------------------------------

const policyTrueDecoder = D.exactDecoder("true");
const policyFalseDecoder = D.exactDecoder("false");
const policyValueDecoder = D.oneOfDecoders(
  policyTrueDecoder,
  policyFalseDecoder,
  D.undefinedDecoder
);

const policyDecoder = D.objectDecoder<Policy>({
  editOthersPosts: policyValueDecoder,
  enableTeamCreation: policyValueDecoder,
  enableOnlyAdminIntegrations: policyValueDecoder,
});

const roleValueDecoder = D.objectDecoder<RoleValue>({
  name: D.stringDecoder,
  permissions: D.arrayDecoder(D.stringDecoder),
});

const rolePossibleValueDecoder = D.oneOfDecoders(
  roleValueDecoder,
  D.undefinedDecoder
);

const roleDecoder = D.objectDecoder<Roles>({
  system_admin: rolePossibleValueDecoder,
  system_user: rolePossibleValueDecoder,
  team_admin: rolePossibleValueDecoder,
  team_user: rolePossibleValueDecoder,
});

//  Decode mattremost Permissions.
//  To check if MMPermission have the correct values
const mattermostPermissionsDecoder = D.objectDecoder<MMPermissions>({
  CREATE_TEAM: D.exactDecoder(MMPermission.CREATE_TEAM),
  EDIT_OTHERS_POSTS: D.exactDecoder(MMPermission.EDIT_OTHERS_POSTS),
  MANAGE_INCOMING_WEBHOOKS: D.exactDecoder(
    MMPermission.MANAGE_INCOMING_WEBHOOKS
  ),
  MANAGE_OUTGOING_WEBHOOKS: D.exactDecoder(
    MMPermission.MANAGE_OUTGOING_WEBHOOKS
  ),
  MANAGE_SLASH_COMMANDS: D.exactDecoder(MMPermission.MANAGE_SLASH_COMMANDS),
  MANAGE_OAUTH: D.exactDecoder(MMPermission.MANAGE_OAUTH),
});

// Check JSON valid types
// ---------------------------

// Given Roles should remove undefined keys
//
// Roles => Roles
function removeUndefinedProperties(role: Roles): Roles {
  return Object.fromEntries(
    Object.entries(role).filter(([, value]) => value !== undefined)
  );
}

// Given JSON object, should remove undefined values from decoded roles
//
// (unknown) => D.Result<Roles>
function decodeRoles(roles: unknown): D.Result<Roles> {
  return roleDecoder.decode(roles).map(removeUndefinedProperties);
}

// Given D.Result<Roles> should check Result.type === "Ok" and return Roles
// else return empty Roles
//
// D.Result<Roles> => Roles
function checkRoles(roles: D.Result<Roles>): Roles {
  switch (roles.type) {
    case "OK":
      return roles.value;
    case "ERR":
      console.error(roles.message);
      return {} as Roles;
    default:
      return {} as Roles;
  }
}

// Given Policy should remove undefined properties
//
// Policy => Policy
function removeUndefinedPropertiesPolicy(policy: Policy): Policy {
  return Object.fromEntries(
    Object.entries(policy).filter(([, value]) => value !== undefined)
  );
}

// Given JSON object, should remove undefined values from decoded policies
//
// (unknown) => D.Result<Policy>
function decodePolicies(policies: unknown): D.Result<Policy> {
  return policyDecoder.decode(policies).map(removeUndefinedPropertiesPolicy);
}

// Given D.Result<Policy> should check Result.type === "Ok" and return Policy
// else show an error and return empty Policy
//
// D.Result<Policy> => Policy
function checkPolicies(policies: D.Result<Policy>): Policy {
  switch (policies.type) {
    case "OK":
      return policies.value;
    case "ERR":
      console.error(policies.message);
      return {} as Policy;
    default:
      return {} as Policy;
  }
}

// Given permissions JSON object, should return true if policies are valid
// else show an error return false
// we need to ckeck if MMPermission match with mattermostPermissions
//
// (unknown) => boolean
function isValidPermissions(permissions: unknown): boolean {
  const result = mattermostPermissionsDecoder.decode(permissions);
  switch (result.type) {
    case "OK":
      return true;
    case "ERR":
      console.error(
        result.message,
        ". MMPermission should match with mattermost Permissions, same keys and values"
      );
      return false;
    default:
      return false;
  }
}

// Roles data
// ------------

// Given Mapping, MappingKey, MappingValue, should return a list of MappingRole
//
// Mapping => MappingKey => MappingValue => MappingRole[]
function getMappingRoles(
  mapping: Mapping,
  key: MappingKey,
  value: MappingValue
): MappingRole[] {
  return mapping[key][value];
}

// Given MMPermission, RoleValue, should
// update permissios list with oermission value
// RoleValue permissions list should contain unique values
//
// MMPermission => RoleValue => RoleValue
function addPermissionToRoleValue(
  permission: MMPermission,
  roleValue: RoleValue
): RoleValue {
  return {
    ...roleValue,
    permissions: [...new Set([...roleValue.permissions, permission])],
  };
}

// Given MMPermission, RoleValue, should remove the permission
// from RoleValue permissions list
//
// MMPermission => RoleValue => RoleValue
function removePermissionToRoleValue(
  permission: MMPermission,
  roleValue: RoleValue
): RoleValue {
  return {
    ...roleValue,
    permissions: roleValue.permissions.filter(
      (rolePermission) => rolePermission !== permission
    ),
  };
}

// Given list of MappingRole, Roles
// should drop the Roles that is not present in the list of MappingRole
//
// MappingRole[] => Roles => Roles
function dropNotNeededRoles(mappingRoles: MappingRole[], role: Roles): Roles {
  return mappingRoles.reduce((acc, mappingRole) => {
    const roleKeys = Object.keys(role);
    const { roleName } = mappingRole;
    if (roleKeys.includes(roleName)) {
      return { ...acc, [roleName]: role[roleName] };
    }
    return acc;
  }, {});
}

// Given list MappingRole, Roles, iterate over MappingRole comparing
// MappingRole.name with Roles keys, if equals add or remove permission
// based on shouldHave value
//
// MappingRole[] => Roles => Roles
function addOrRemovePermissions(
  mappingRoles: MappingRole[],
  role: Roles
): Roles {
  return mappingRoles.reduce((acc, mappingRole) => {
    const { roleName, permission, shouldHave } = mappingRole;
    const roleValue = acc[roleName];
    if (roleValue) {
      const newRoleValue = shouldHave
        ? addPermissionToRoleValue(permission, roleValue)
        : removePermissionToRoleValue(permission, roleValue);
      return { ...acc, [roleName]: newRoleValue };
    }
    return acc;
  }, role);
}

// Policy data
// ------------

// Given Policy, Mapping should getMappingRoles for each key and value
// return a list of MappingRole.
// If policy is empty, return an empty list
//
// Policy => Mapping => MappingRole[]
function getPolicyMappingRoles(
  policy: Policy,
  mapping: Mapping
): MappingRole[] {
  if (Object.keys(policy).length === 0) {
    return [];
  }

  return Object.entries(policy).flatMap(([key, value]) =>
    getMappingRoles(mapping, key as MappingKey, value as MappingValue)
  );
}

// Should return Mapping, using MMPermission
//
// () => Mapping
function getMapping(): Mapping {
  return {
    enableTeamCreation: {
      true: [
        {
          roleName: "system_user",
          permission: MMPermission.CREATE_TEAM,
          shouldHave: true,
        },
      ],
      false: [
        {
          roleName: "system_user",
          permission: MMPermission.CREATE_TEAM,
          shouldHave: false,
        },
      ],
    },

    editOthersPosts: {
      true: [
        {
          roleName: "system_admin",
          permission: MMPermission.EDIT_OTHERS_POSTS,
          shouldHave: true,
        },
        {
          roleName: "team_admin",
          permission: MMPermission.EDIT_OTHERS_POSTS,
          shouldHave: true,
        },
      ],
      false: [
        {
          roleName: "team_admin",
          permission: MMPermission.EDIT_OTHERS_POSTS,
          shouldHave: false,
        },
        {
          roleName: "system_admin",
          permission: MMPermission.EDIT_OTHERS_POSTS,
          shouldHave: true,
        },
      ],
    },

    enableOnlyAdminIntegrations: {
      true: [
        {
          roleName: "team_user",
          permission: MMPermission.MANAGE_INCOMING_WEBHOOKS,
          shouldHave: false,
        },
        {
          roleName: "team_user",
          permission: MMPermission.MANAGE_OUTGOING_WEBHOOKS,
          shouldHave: false,
        },
        {
          roleName: "team_user",
          permission: MMPermission.MANAGE_SLASH_COMMANDS,
          shouldHave: false,
        },
        {
          roleName: "system_user",
          permission: MMPermission.MANAGE_OAUTH,
          shouldHave: false,
        },
      ],
      false: [
        {
          roleName: "team_user",
          permission: MMPermission.MANAGE_INCOMING_WEBHOOKS,
          shouldHave: true,
        },
        {
          roleName: "team_user",
          permission: MMPermission.MANAGE_OUTGOING_WEBHOOKS,
          shouldHave: true,
        },
        {
          roleName: "team_user",
          permission: MMPermission.MANAGE_SLASH_COMMANDS,
          shouldHave: true,
        },
        {
          roleName: "system_user",
          permission: MMPermission.MANAGE_OAUTH,
          shouldHave: true,
        },
      ],
    },
  };
}

// Init
// -------

// Given unknown policies, unknown roles,
// ckeck that roles and policies are valid.
// should return a new Roles with the updated permissions
//
// unnown => unknown => unknown => Roles
function getNewRole(
  policies: unknown = {},
  roles: Record<string, Role> = {}
): Record<string, Role> {
  if (!isValidPermissions(MattermostPermissions)) {
    return {} as Record<string, Role>;
  }

  // console.log("roles", roles);
  const decodedRoles = decodeRoles(roles);
  const checkedRoles = checkRoles(decodedRoles);
  const decodedPolicies = decodePolicies(policies);
  const checkedPolicies = checkPolicies(decodedPolicies);
  const mapping = getMapping();
  const mappingRoles = getPolicyMappingRoles(checkedPolicies, mapping);
  const filteredRoles = dropNotNeededRoles(mappingRoles, checkedRoles);

  return addOrRemovePermissions(mappingRoles, filteredRoles) as Record<
    string,
    Role
  >;
}

// Tests
// -------

console.log(" ------------------ start ----------------------");
// getNewRole(mockedPolicies, mockedRole);
console.log(getNewRole(mockedPolicies, mockedRole));
console.log(" ------------------ end ----------------------");
