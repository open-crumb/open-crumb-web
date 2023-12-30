CREATE MIGRATION m1k3tptxk7yb3j4aeod2hc7vs5kqrsedxmleaf4w7m4hz47mecs7gq
    ONTO m1jvkzokopl3go3l6c5ga5upohhja4naizcn6m3ayenygcums67hyq
{
  ALTER TYPE default::Auditable {
      ALTER PROPERTY createdAt {
          SET readonly := true;
      };
  };
  CREATE GLOBAL default::currentUser := (std::assert_single((SELECT
      default::User {
          id
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  ALTER TYPE default::Auditable {
      ALTER PROPERTY modifiedAt {
          DROP REWRITE
              INSERT ;
          };
      };
  ALTER TYPE default::Auditable {
      ALTER PROPERTY modifiedAt {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_current());
      };
  };
  ALTER TYPE default::Auditable {
      ALTER PROPERTY modifiedAt {
          DROP REWRITE
              UPDATE ;
          };
      };
  ALTER TYPE default::Auditable {
      ALTER PROPERTY modifiedAt {
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_current());
      };
  };
};
