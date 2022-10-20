import Permission from "./permissions";

// mocked data
// ------------
//
// dummy roleSS
export const mockedRole = {
  channel_user: {
    name: "channel_user",
    permissions: [
      Permissions.EDIT_POST,
      Permissions.DELETE_POST,
      Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS,
    ],
  },
  team_user: {
    name: "team_user",
    permissions: [
      Permissions.INVITE_USER,
      Permissions.ADD_USER_TO_TEAM,
      Permissions.CREATE_PUBLIC_CHANNEL,
      Permissions.CREATE_PRIVATE_CHANNEL,
      Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES,
      Permissions.DELETE_PUBLIC_CHANNEL,
      Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES,
      Permissions.DELETE_PRIVATE_CHANNEL,
    ],
  },
  channel_admin: {
    name: "channel_admin",
    permissions: [Permissions.MANAGE_CHANNEL_ROLES],
  },
  team_admin: {
    name: "team_admin",
    permissions: [Permissions.DELETE_POST, Permissions.DELETE_OTHERS_POSTS],
  },
  system_admin: {
    name: "system_admin",
    permissions: [
      Permissions.DELETE_PUBLIC_CHANNEL,
      Permissions.INVITE_USER,
      Permissions.ADD_USER_TO_TEAM,
      Permissions.DELETE_POST,
      Permissions.DELETE_OTHERS_POSTS,
      Permissions.EDIT_POST,
    ],
  },
  system_user: {
    name: "system_user",
    permissions: [],
    id: "system_user",
    display_name: "system_user",
  },
};

// dummy policy
export const mockedPolicies = {
  enableTeamCreation: "true",
  // enableOnlyAdminIntegrations: "false",
};
