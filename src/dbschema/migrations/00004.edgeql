CREATE MIGRATION m16kadjt7r2sroqf4hzixuwtaexn7nq6pc2kteeom3pby2uuvjwndq
    ONTO m1guafugbfr66g3mo23cu3m5ztiwflzkzqbobgsi7btf3e4ctvs6xq
{
  ALTER TYPE default::LogbookUpdate {
      ALTER PROPERTY date {
          SET default := (std::datetime_current());
      };
  };
};
