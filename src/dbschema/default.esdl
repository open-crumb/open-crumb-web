using extension auth;
using extension edgeql_http;

module default {
  global currentUser := (
    assert_single((
      select User { id }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  abstract type Auditable {
    required createdAt: datetime {
      default := datetime_current();
      readonly := true;
    };
    required modifiedAt: datetime {
      default := datetime_current();
      rewrite insert, update using (datetime_current());
    };
  }

  abstract type Archivable {
    archivedAt: datetime;
  }

  type User extending Auditable {
    annotation description := '
      User profile data not included in `ext::auth::Identity`.
    ';

    required identity: ext::auth::Identity;
    required name: str;
    multi logbookEntries := .<owner[is LogbookEntry];
  }

  type LogbookEntry extending Auditable, Archivable {
    annotation description := '
      Represents the process for an individual bake or project the user is
      working on.
    ';

    required owner: User;
    required title: str {
      default := '';
    };
    required description: str {
      default := '';
    };
    multi updates := .<entry[is LogbookUpdate];
  }

  type LogbookUpdate extending Auditable, Archivable {
    annotation description := '
      An update or step in a logbook entry. Examples may be preparing the levain, folding the dough, or shaping.
    ';

    required entry: LogbookEntry;
    required date: datetime {
      default := datetime_current();
    };
    required title: str {
      default := '';
    };
    required description: str {
      default := '';
    };
    multi ingredients := .<`update`[is LogbookIngredient];
    multi measurements := .<`update`[is LogbookMeasurement];
  }

  scalar type IngredientUnit extending enum<
    MassGram,
    MassKilogram,
    VolumeMilliliter,
    VolumeLiter,
    MassOunce,
    MassPound,
    VolumeTeaspoon,
    VolumeTablespoon,
    VolumeCup,
    VolumeFluidOunce,
    VolumePint,
    VolumeQuart,
    VolumeGallon
  > {
    annotation description := '
      Ingredient units per the [Unicode CLDR](https://github.com/unicode-org/cldr/blob/main/common/validity/unit.xml).
    ';
  }

  type LogbookIngredient extending Auditable, Archivable {
    annotation description := 'Ingredients used during a logbook update.';

    required `update`: LogbookUpdate;
    required name: str {
      default := '';
    };
    quantity: float32;
    unit: IngredientUnit;
  }

  scalar type MeasurementUnit extending enum<
    TemperatureFahrenheit,
    TemperatureCelsius,
    Percent
  > {
    annotation description := '
      Measurement units per the [Unicode CLDR](https://github.com/unicode-org/cldr/blob/main/common/validity/unit.xml).
    ';
  }

  type LogbookMeasurement extending Auditable, Archivable {
    annotation description := '
      User taken measurements during a logbook update. Examples may be dough temperature, or humidity.
    ';

    required `update`: LogbookUpdate;
    required name: str {
      default := '';
    };
    value: float32;
    unit: MeasurementUnit;
  }
};
