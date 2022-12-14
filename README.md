# mm policy roles adapter

***Just for fun and practice with typescript.***

Ticket from mattermost project [Migrate "utils/policy_roles_adapter.js" to Typescript #21167](https://github.com/mattermost/mattermost-server/issues/21167)

**Goal for refactorization**

* strongly data types.
* tried to follow Elm lang style.
* every function get an input and returns an output.
* no data mutation.
* each unknown datatype object it's checked.
* pass the same tests that already exists in Mattermost-web project.
* module was isolated to be developed in NODE.

## Clone the repo & install:
```
git clone "https://github.com/type-script-studies/mm-utility-policy-roles-adapter.git"

cd  ./mm-utility-policy-roles-adapter
npm install
```
## Scripts:
The `package.json` file comes with the following scripts

* `start` start watching for modifications (show logs).
* `test` run provided tests.
* `test:watch` start watching for modifications on the provided tests.

## Docker:
npm install if you haven't done it yet.
```
cd ./mm-utility-policy-roles-adapter

docker compose up -d
docker logs <container name> -f
```
two docker containers
* policy-roles-adapter-dev (logs).
* policy-roles-adapter-test (tests).

## Useful links:
**suxxus/mattermost-webapp**

forked mattemost-web repository, to check if the integration of the refactored code works as expected.

[File: policy_roles_adapter.ts](https://github.com/suxxus/mattermost-webapp/blob/Feature/%2321167-migrate-to-ts-refactor-proposal/utils/policy_roles_adapter.ts)

[changes](https://github.com/mattermost/mattermost-webapp/compare/master...suxxus:mattermost-webapp:Feature/%2321167-migrate-to-ts-refactor-proposal?expand=1)


