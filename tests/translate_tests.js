module('init');

test('Must pass something to initialization', function(){
  throws(
    function(){
      TRANSLATE.init();
    },
    'Undefined passed to init'
  );

  throws(
    function(){
      TRANSLATE.init('');
    },
    'String passed to init'
  );

  throws(
    function(){
      TRANSLATE.init(null);
    },
    'NULL passed to init'
  );
});

test('Wrong format passed as `locale_or_phrases`', function(){
  throws(
    function(){
      TRANSLATE.init({});
    },
    'Empty data passed to init'
  );

  throws(
    function(){
      var _data = {
        "locale": undefined
      };

      TRANSLATE.init(_data);
    },
    'Undefined passed as locale'
  );

  throws(
    function(){
      var _data = {
        "locale": ''
      };

      TRANSLATE.init(_data);
    },
    'Empty string passed as locale'
  );

  throws(
    function(){
      var _data = {
        "locale": null
      };

      TRANSLATE.init(_data);
    },
    'NULL passed as locale'
  );

  throws(
    function(){
      var _data = {
        "locale": {}
      };

      TRANSLATE.init(_data);
    },
    'Object passed as locale'
  );

  throws(
    function(){
      var _data = {
        "locale": "en"
      };

      TRANSLATE.init(_data);
    },
    'Correct locale but no phrases/messages/strings passed'
  );

  throws(
    function(){
      var _data = {
        "locale":  "en",
        "strings": {}
      };

      TRANSLATE.init(_data);
    },
    'Locale + empty `Strings` passed (assuming that `Messages` and `Phrases` would do the same)'
  );

  throws(
    function(){
      var _data = {
        "locale":  "en",
        "strings": {
          "test": [
            "Test",
            "Tests"
          ]
        }
      };

      TRANSLATE.init(_data);
    },
    'Locale + `Strings` without translations passed'
  );
});