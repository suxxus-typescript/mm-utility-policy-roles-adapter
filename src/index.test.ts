import { MattermostPermissions as Permissions } from "./mockData";
import { mappingValueFromRoles, rolesFromMapping } from "./index";

function addPermissionToRole(permission, role) {
  if (!role.permissions.includes(permission)) {
    role.permissions.push(permission);
  }
}

function removePermissionFromRole(permission, role) {
  const permissionIndex = role.permissions.indexOf(permission);
  if (permissionIndex !== -1) {
    role.permissions.splice(permissionIndex, 1);
  }
}

describe("PolicyRolesAdapter", () => {
  let roles = {};
  let policies = {};

  beforeEach(() => {
    roles = {
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
        permissions: [Permissions.CREATE_TEAM],
      },
    };
  });

  const teamPolicies = {
    restrictTeamInvite: "all",
  };

  policies = {
    ...teamPolicies,
  };

  afterEach(() => {
    roles = {};
  });

  describe("PolicyRolesAdapter.rolesFromMapping", () => {
    test("given a policy with a value that is not present in mapping, should show console.error ", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      policies.enableTeamCreation = "sometimesmaybe";
      rolesFromMapping(policies, roles);
      expect(consoleSpy).toHaveBeenCalled();
    });

    // That way you can pass in the whole state if you want.
    test("Given an unknown policy key, should return an empty Object", () => {
      const updatedRoles = rolesFromMapping(policies, roles);
      expect(Object.keys(updatedRoles).length).toEqual(0);
    });

    test("mock data setup", () => {
      const updatedRoles = rolesFromMapping(policies, roles);
      expect(Object.values(updatedRoles).length).toEqual(0);
    });

    describe("enableTeamCreation", () => {
      test("Given policy enableTeamCreation as 'true' should update system_user pernissions list", () => {
        roles.system_user.permissions = [];
        const updatedRoles = rolesFromMapping(
          { enableTeamCreation: "true" },
          roles
        );
        expect(updatedRoles.system_user.permissions).toEqual(
          expect.arrayContaining([Permissions.CREATE_TEAM])
        );
      });

      test("Given policy enableTeamCreation as 'false' should update system_user permissions list", () => {
        roles.system_user.permissions = [Permissions.CREATE_TEAM];
        const updatedRoles = rolesFromMapping(
          { enableTeamCreation: "false" },
          roles
        );
        expect(updatedRoles.system_user.permissions).not.toEqual(
          expect.arrayContaining([Permissions.CREATE_TEAM])
        );
      });

      test("it only returns the updated roles", () => {
        let updatedRoles = rolesFromMapping(
          { enableTeamCreation: "true" },
          roles
        );
        expect(Object.keys(updatedRoles).length).toEqual(1);

        updatedRoles = rolesFromMapping(policies, roles);
        expect(Object.keys(updatedRoles).length).toEqual(0);
      });
    });
    // ----------------------------
    describe("PolicyRolesAdapter.mappingValueFromRoles", () => {
      describe("enableTeamCreation", () => {
        test("returns the expected policy value for a enableTeamCreation policy", () => {
          addPermissionToRole(Permissions.CREATE_TEAM, roles.system_user);
          let value = mappingValueFromRoles("enableTeamCreation", roles);
          expect(value).toEqual("true");

          removePermissionFromRole(Permissions.CREATE_TEAM, roles.system_user);
          value = mappingValueFromRoles("enableTeamCreation", roles);
          expect(value).toEqual("false");
        });
      });

      describe("editOthersPosts", () => {
        test("returns the expected policy value for a editOthersPosts policy", () => {
          addPermissionToRole(
            Permissions.EDIT_OTHERS_POSTS,
            roles.system_admin
          );
          let value = mappingValueFromRoles("editOthersPosts", roles);
          expect(value).toEqual("true");

          removePermissionFromRole(
            Permissions.EDIT_OTHERS_POSTS,
            roles.system_admin
          );
          value = mappingValueFromRoles("editOthersPosts", roles);
          expect(value).toEqual("false");
        });
      });
    });
  });
});
