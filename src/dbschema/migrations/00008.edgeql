CREATE MIGRATION m1w2lwpirf7j5p4x3je66dppsg5ugf6366z6ilmvgwdllei67zc53q
    ONTO m162uslcxy4zkh2qjqmv7npcilgych74imsdoer6ttvi7hzqtgobwq
{
  ALTER TYPE default::Auditable {
      ALTER PROPERTY modifiedAt {
          SET default := (std::datetime_current());
      };
  };
};
