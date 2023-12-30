CREATE MIGRATION m162uslcxy4zkh2qjqmv7npcilgych74imsdoer6ttvi7hzqtgobwq
    ONTO m1yrfmmxlmgrek4xbkiaqpslltipaorzr57xir643zdrcs3plrhqdq
{
  ALTER TYPE default::LogbookIngredient {
      ALTER PROPERTY quantity {
          SET TYPE std::float32;
      };
  };
  ALTER TYPE default::LogbookMeasurement {
      ALTER PROPERTY value {
          SET TYPE std::float32;
      };
  };
};
