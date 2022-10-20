import Permissions from "./permissions";

// mocked data
// ------------
//
// dummy default Role
const role = {
  id: "",
  name: "",
  display_name: "",
  description: "",
  create_at: 0,
  update_at: 0,
  delete_at: 0,
  permissions: [],
  scheme_managed: false,
  built_in: false,
};

// dummy role
export const mockedRole = {
  channel_user: {
    ...role,
    name: "channel_user",
    permissions: [
      Permissions.EDIT_POST,
      Permissions.DELETE_POST,
      Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS,
    ],
  },
  team_user: {
    ...role,
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
    ...role,
    name: "channel_admin",
    permissions: [Permissions.MANAGE_CHANNEL_ROLES],
  },
  team_admin: {
    ...role,
    name: "team_admin",
    permissions: [Permissions.DELETE_POST, Permissions.DELETE_OTHERS_POSTS],
  },
  system_admin: {
    ...role,
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
    ...role,
    name: "system_user",
    permissions: [],
  },
};

// dummy policy
export const mockedPolicies = {
  enableTeamCreation: "true",
  // enableOnlyAdminIntegrations: "false",
};
