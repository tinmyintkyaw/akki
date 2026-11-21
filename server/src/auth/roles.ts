import { createAccessControl } from "better-auth/plugins";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  content: ["read", "write"],
} as const;

const ac = createAccessControl(statement);

const guest = ac.newRole({ content: ["read"] });

const member = ac.newRole({
  ...memberAc.statements,
  content: ["read", "write"],
});

const admin = ac.newRole({ ...adminAc.statements, content: ["read", "write"] });

const owner = ac.newRole({ ...ownerAc.statements, content: ["read", "write"] });

export { ac, admin, guest, member, owner, statement };
