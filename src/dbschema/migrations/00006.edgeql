CREATE MIGRATION m1yrfmmxlmgrek4xbkiaqpslltipaorzr57xir643zdrcs3plrhqdq
    ONTO m1kehhue2yy2onbdndy5pxs2rv4hw7ikarkmr6vn3ph4vpthulbb7a
{
  ALTER TYPE default::LogbookIngredient {
      ALTER PROPERTY quantity {
          SET TYPE std::float64 USING (<std::float64>.quantity);
      };
  };
  ALTER TYPE default::LogbookMeasurement {
      ALTER PROPERTY value {
          SET TYPE std::float64 USING (<std::float64>.value);
      };
  };
};
