CREATE MIGRATION m1jvkzokopl3go3l6c5ga5upohhja4naizcn6m3ayenygcums67hyq
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE ABSTRACT TYPE default::Archivable {
      CREATE PROPERTY archivedAt: std::datetime;
  };
  CREATE ABSTRACT TYPE default::Auditable {
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY modifiedAt: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE TYPE default::LogbookEntry EXTENDING default::Auditable, default::Archivable {
      CREATE ANNOTATION std::description := '\n      Represents the process for an individual bake or project the user is\n      working on.\n    ';
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE SCALAR TYPE default::IngredientUnit EXTENDING enum<MassGram, MassKilogram, VolumeMilliliter, VolumeLiter, MassOunce, MassPound, VolumeTeaspoon, VolumeTablespoon, VolumeCup, VolumeFluidOunce, VolumePint, VolumeQuart, VolumeGallon> {
      CREATE ANNOTATION std::description := '\n      Ingredient units per the [Unicode CLDR](https://github.com/unicode-org/cldr/blob/main/common/validity/unit.xml).\n    ';
  };
  CREATE TYPE default::LogbookIngredient EXTENDING default::Auditable, default::Archivable {
      CREATE ANNOTATION std::description := 'Ingredients used during a logbook update.';
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY quantity: std::decimal;
      CREATE PROPERTY unit: default::IngredientUnit;
  };
  CREATE SCALAR TYPE default::MeasurementUnit EXTENDING enum<TemperatureFahrenheit, TemperatureCelsius, Percent> {
      CREATE ANNOTATION std::description := '\n      Measurement units per the [Unicode CLDR](https://github.com/unicode-org/cldr/blob/main/common/validity/unit.xml).\n    ';
  };
  CREATE TYPE default::LogbookMeasurement EXTENDING default::Auditable, default::Archivable {
      CREATE ANNOTATION std::description := '\n      User taken measurements during a logbook update. Examples may be dough temperature, or humidity.\n    ';
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY unit: default::MeasurementUnit;
      CREATE PROPERTY value: std::decimal;
  };
  CREATE TYPE default::LogbookUpdate EXTENDING default::Auditable, default::Archivable {
      CREATE REQUIRED LINK entry: default::LogbookEntry;
      CREATE ANNOTATION std::description := '\n      An update or step in a logbook entry. Examples may be preparing the levain, folding the dough, or shaping.\n    ';
      CREATE REQUIRED PROPERTY date: std::datetime;
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::User EXTENDING default::Auditable {
      CREATE ANNOTATION std::description := '\n      User profile data not included in `ext::auth::Identity`.\n    ';
      CREATE REQUIRED LINK identity: ext::auth::Identity;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  ALTER TYPE default::LogbookEntry {
      CREATE REQUIRED LINK owner: default::User;
      CREATE MULTI LINK updates := (.<entry[IS default::LogbookUpdate]);
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK logbookEntries := (.<owner[IS default::LogbookEntry]);
  };
  ALTER TYPE default::LogbookIngredient {
      CREATE REQUIRED LINK `update`: default::LogbookUpdate;
  };
  ALTER TYPE default::LogbookUpdate {
      CREATE MULTI LINK ingredients := (.<`update`[IS default::LogbookIngredient]);
  };
  ALTER TYPE default::LogbookMeasurement {
      CREATE REQUIRED LINK `update`: default::LogbookUpdate;
  };
  ALTER TYPE default::LogbookUpdate {
      CREATE MULTI LINK measurements := (.<`update`[IS default::LogbookMeasurement]);
  };
};
