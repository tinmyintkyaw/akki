import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  const updatedAtTriggerQuery = sql`
  CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at := now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER set_space_updated_at_trigger
  BEFORE UPDATE ON space
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

  CREATE TRIGGER set_page_updated_at_trigger
  BEFORE UPDATE ON page
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();

  CREATE TRIGGER set_tag_updated_at_trigger
  BEFORE UPDATE ON tag
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();
  `;

  await db.executeQuery(updatedAtTriggerQuery.compile(db));
};

export const down = async (db: Kysely<any>) => {
  const dropUpdatedAtTriggerQuery = sql`
  DROP TRIGGER IF EXISTS set_space_updated_at_trigger ON space;
  DROP TRIGGER IF EXISTS set_tag_updated_at_trigger ON tag;
  DROP TRIGGER IF EXISTS set_page_updated_at_trigger ON page;
  DROP FUNCTION IF EXISTS set_updated_at_timestamp() CASCADE;
  `;

  await db.executeQuery(dropUpdatedAtTriggerQuery.compile(db));
};
