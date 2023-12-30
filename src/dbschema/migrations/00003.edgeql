CREATE MIGRATION m1guafugbfr66g3mo23cu3m5ztiwflzkzqbobgsi7btf3e4ctvs6xq
    ONTO m1k3tptxk7yb3j4aeod2hc7vs5kqrsedxmleaf4w7m4hz47mecs7gq
{
  ALTER TYPE default::LogbookEntry {
      ALTER PROPERTY description {
          SET default := '';
      };
      ALTER PROPERTY title {
          SET default := '';
      };
  };
  ALTER TYPE default::LogbookIngredient {
      ALTER PROPERTY name {
          SET default := '';
      };
  };
  ALTER TYPE default::LogbookMeasurement {
      ALTER PROPERTY name {
          SET default := '';
      };
  };
  ALTER TYPE default::LogbookUpdate {
      ALTER PROPERTY description {
          SET default := '';
      };
      ALTER PROPERTY title {
          SET default := '';
      };
  };
};
