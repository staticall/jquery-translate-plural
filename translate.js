/**
 * Translation class with Plural support
 *
 * @author staticall <staticall AT gmail DOT com>
 * @url http://github.com/staticall/jquery-translate-plural/
 */

var TRANSLATE = new function()
{
  var self = this;

  this.is_debug     = false;
  this.locale       = null;
  this.plural_forms = function(n){};
  this.phrases      = {};

  this.init = function(locale_or_phrases, phrases)
  {
    self.log('TRANSLATE.init('+ locale_or_phrases +', '+ phrases +') - method called');

    if(!self.isVarDefined(locale_or_phrases))
    {
      throw 'Data must be defined for initialization';
    }

    try
    {
      var json = $.parseJSON(locale_or_phrases);

      if(json.locale)
      {
        self.setLocale(json.locale);

        if(typeof json.phrases !== 'undefined')
        {
          self.addLocalePhrases(json.phrases);
        }
        else if(json.strings !== 'undefined')
        {
          self.addLocalePhrases(json.strings);
        }
        else if(json.messages !== 'undefined')
        {
          self.addLocalePhrases(json.messages);
        }

        return true;
      }

      self.log('TRANSLATE.init('+ locale_or_phrases +', '+ phrases +') - Unknown format of locale_or_strings variable, value: `'+ locale_or_phrases +'`');
      throw 'Unknown `locale_or_strings` format';
    }
    catch(e)
    {
      if(e !== 'Unknown `locale_or_strings` format')
      {
        if(typeof locale_or_phrases === 'object')
        {
          try
          {
            self.setLocale(locale_or_phrases.locale);

            phrases = locale_or_phrases.phrases;
          }
          catch(e)
          {
          }
        }
        else
        {
          self.setLocale(locale_or_phrases);
        }
      }
      else
      {
        self.log('TRANSLATE.init('+ locale_or_phrases +', '+ phrases +') - class not initialized, required data is missing');
        throw 'Class not initialized, required data is missing';
      }
    }

    self.addLocalePhrases(phrases);

    self.setPluralForms(self.getPluralFormByLocale());

    self.log('TRANSLATE.init('+ locale_or_phrases +', '+ phrases +') - return: null');
  };

  this._ = function(text, count, locale)
  {
    if(!self.isVarDefined(text))
    {
      throw 'Can not translate empty string';
    }

    if(count === -1 || count === null || typeof count === 'undefined' || isNaN(count))
    {
      count = -1;
    }
    else
    {
      count = count - 0;
    }

    if(!self.isVarDefined(locale))
    {
      locale = self.getLocale();
    }

    var result = '';

    self.log('TRANSLATE._('+ text +', '+ count +', '+ locale +') - method called');

    var phrase_plural;

    if(count !== -1)
    {
      phrase_plural = self.getPluralForm(count, locale);

      try
      {
        self.log('TRANSLATE._('+ text +', '+ count +', '+ locale +') - trying get correct plural form, result: '+ self.phrases[locale][text][phrase_plural], 'debug');

        result = self.phrases[locale][text][phrase_plural];

        if(typeof result === 'undefined')
        {
          return text;
        }

        return result;
      }
      catch(e)
      {
        self.log('TRANSLATE._('+ text +', '+ count +', '+ locale +') - exception catched, message is not plural', 'debug');

        return text;
      }
    }

    if(typeof self.phrases[locale] === 'object' && typeof self.phrases[locale][text] === 'object')
    {
      try
      {
        self.log('TRANSLATE._('+ text +', '+ count +', '+ locale +') - trying to get first array element, result: '+ self.phrases[locale][text][0], 'debug');

        result = self.phrases[locale][text][0];

        if(typeof result === 'undefined')
        {
          return text;
        }

        return result;
      }
      catch(e)
      {
        self.log('TRANSLATE._('+ text +', '+ count +', '+ locale +') - exception catched, first element of array not exists', 'debug');

        return text;
      }
    }
    else
    {
      try
      {
        self.log('TRANSLATE._('+ text +', '+ count +', '+ locale +') - trying to get phrase, result: '+ self.phrases[locale][text], 'debug');

        result = self.phrases[locale][text];

        if(typeof result === 'undefined')
        {
          return text;
        }

        return result;
      }
      catch(e)
      {
        self.log('TRANSLATE._('+ text +', '+ count +', '+ locale +') - exception catched, phrase not exists', 'debug');

        return text;
      }
    }
  };

  this.translate = function(text, count, locale)
  {
    return self._(text, count, locale);
  };

  this.addLocalePhrases = function(phrases, locale)
  {
    if(!self.isVarDefined(locale))
    {
      locale = self.getLocale();
    }

    self.log('TRANSLATE.addLocalePhrases('+ phrases +', '+ locale +') - method called. Redirect to TRANSLATE.setPhrases() with same attributes', 'debug');

    return self.setPhrases(phrases, locale);
  };

  this.getLocale = function()
  {
    return self.locale;
  };

  this.setLocale = function(locale)
  {
    self.log('TRANSLATE.setLocale('+ locale +') - method called', 'debug');

    if(!self.isVarDefined(locale))
    {
      self.log('TRANSLATE.setLocale('+ locale +') - locale not defined or null', 'debug');
      throw 'Locale must be defined';
    }

    var loc;

    if(locale.indexOf('-') !== -1)
    {
      loc    = locale.split('-');
      locale = loc[0];
    }
    else if(locale.indexOf('_') !== -1)
    {
      loc    = locale.split('_');
      locale = loc[0];
    }

    locale = locale.toLowerCase();

    if(!self.validateLocaleString(locale))
    {
      self.log('TRANSLATE.setLocale('+ locale +') - incorrect locale passed', 'debug');
      throw "Parsed locale invalid, string must be 2 chars in length. Trying validate '"+ locale +"'";
    }

    self.locale = locale;

    self.log('TRANSLATE.setLocale('+ locale +') - result: '+ locale, 'debug');

    return locale;
  };

  this.getPhrases = function(locale)
  {
    self.log('TRANSLATE.getPhrases('+ locale +') - method called', 'debug');

    if(self.isVarDefined(locale))
    {
      self.log('TRANSLATE.getPhrases('+ locale +') - result: '+ self.phrases[locale], 'debug');

      return self.phrases[locale];
    }

    self.log('TRANSLATE.getPhrases() - result: '+ self.phrases, 'debug');

    return self.phrases;
  };

  this.setPhrases = function(phrases, locale)
  {
    self.log('TRANSLATE.setPhrases('+ phrases +', '+ locale +') - method called', 'debug');

    if(!self.isVarDefined(phrases))
    {
      self.log('TRANSLATE.setPhrases('+ phrases +', '+ locale +') - phrases not defined', 'debug');
      throw 'Phrases must be defined';
    }

    if(!self.isVarDefined(locale))
    {
      locale = self.getLocale();
    }

    if(typeof phrases === 'object')
    {
      self.phrases[locale] = phrases;
    }
    else
    {
      try
      {
        phrases = $.parseJSON(phrases);
        self.phrases[locale] = phrases;
      }
      catch(e)
      {
        if(typeof phrases !== 'object')
        {
          self.log('TRANSLATE.setPhrases('+ phrases +', '+ locale +') - incorrect phrases format', 'debug');
          throw 'Phrases must be in JSON format';
        }
        else
        {
          self.phrases[locale] = phrases;
        }
      }
    }

    self.log('TRANSLATE.setPhrases('+ phrases +', '+ locale +') - result: '+ phrases, 'debug');

    return phrases;
  };

  this.getMessages = function(locale)
  {
    self.log('TRANSLATE.getMessages('+ locale +') - method called. Redirect to TRANSLATE.getPhrases() with same attributes', 'debug');

    return self.getPhrases(locale);
  };

  this.setMessages = function(messages, locale)
  {
    self.log('TRANSLATE.setMessages('+ messages +', '+ locale +') - method called. Redirect to TRANSLATE.setPhrases() with same attributes', 'debug');

    return self.setPhrases(messages, locale);
  };

  this.getStrings = function(locale)
  {
    self.log('TRANSLATE.getStrings('+ locale +') - method called. Redirect to TRANSLATE.getPhrases() with same attributes', 'debug');

    return self.getPhrases(locale);
  };

  this.setStrings = function(strings, locale)
  {
    self.log('TRANSLATE.setStrings('+ strings +', '+ locale +') - method called. Redirect to TRANSLATE.setPhrases() with same attributes', 'debug');

    return self.setPhrases(strings, locale);
  };

  this.getPluralForm = function(n, locale)
  {
    if(!self.isVarDefined(locale))
    {
      locale = self.getLocale();
    }

    self.log('TRANSLATE.getPluralForm('+ n +', '+ locale +') - method called', 'debug');

    var plural_form = self.plural_forms;

    if(self.isVarDefined(locale))
    {
      plural_form = self.getPluralFormByLocale(true, locale);
    }

    plural_form = plural_form(n);

    self.log('TRANSLATE.getPluralForm('+ n +', '+ locale +') - result: '+ plural_form, 'debug');

    return plural_form;
  };

  this.setPluralForms = function(plural_form)
  {
    self.log('TRANSLATE.getPluralForm('+ plural_form +') - method called', 'debug');

    if(!self.isVarDefined(plural_form))
    {
      self.log('TRANSLATE.getPluralForm('+ plural_form +') - Plural Form undefined, result: false', 'debug');
      throw 'Plural forms must be defined';

      return false;
    }

    if(typeof plural_form === 'function')
    {
      self.plural_forms = plural_form;
    }

    self.log('TRANSLATE.getPluralForm('+ plural_form +') - result: true', 'debug');

    return true;
  };

  this.getPluralFormByLocale = function(is_set, locale)
  {
    if(!self.isVarDefined(is_set))
    {
      is_set = true;
    }

    if(!self.isVarDefined(locale))
    {
      locale = self.getLocale();
    }

    self.log('TRANSLATE.getPluralFormByLocale('+ is_set +', '+ locale +') - method called', 'debug');

    if(!self.isVarDefined(locale))
    {
      self.log('TRANSLATE.getPluralFormByLocale('+ is_set +', '+ locale +') - locale undefined, result: '+ locale, 'debug');
      throw 'Locale required for Plural Form generation';
    }

    var _func = function(n){};

    switch(locale)
    {
      case 'bo':
      case 'dz':
      case 'id':
      case 'ja':
      case 'jv':
      case 'ka':
      case 'km':
      case 'kn':
      case 'ko':
      case 'ms':
      case 'th':
      case 'tr':
      case 'vi':
      case 'zh':
          _func = function(n)
          {
            return 0;
          };
        break;
      case 'af':
      case 'az':
      case 'bn':
      case 'bg':
      case 'ca':
      case 'da':
      case 'de':
      case 'el':
      case 'en':
      case 'eo':
      case 'es':
      case 'et':
      case 'eu':
      case 'fa':
      case 'fi':
      case 'fo':
      case 'fur':
      case 'fy':
      case 'gl':
      case 'gu':
      case 'ha':
      case 'he':
      case 'hu':
      case 'is':
      case 'it':
      case 'ku':
      case 'lb':
      case 'ml':
      case 'mn':
      case 'mr':
      case 'nah':
      case 'nb':
      case 'ne':
      case 'nl':
      case 'nn':
      case 'no':
      case 'om':
      case 'or':
      case 'pa':
      case 'pap':
      case 'ps':
      case 'pt':
      case 'so':
      case 'sq':
      case 'sv':
      case 'sw':
      case 'ta':
      case 'te':
      case 'tk':
      case 'ur':
      case 'zu':
          _func = function(n)
          {
            return ((n === 1) ? 0 : 1);
          };
        break;
      case 'am':
      case 'bh':
      case 'fil':
      case 'fr':
      case 'gun':
      case 'hi':
      case 'ln':
      case 'mg':
      case 'nso':
      case 'xbr':
      case 'ti':
      case 'wa':
          _func = function(n)
          {
            return (((n === 0) || (n === 1)) ? 0 : 1);
          };
        break;
      case 'be':
      case 'bs':
      case 'hr':
      case 'ru':
      case 'sr':
      case 'uk':
          _func = function(n)
          {
            return ((n % 10 === 1) && (n % 100 !== 11)) ? 0 : (((n % 10 >= 2) && (n % 10 <= 4) && ((n % 100 < 10) || (n % 100 >= 20))) ? 1 : 2);
          };
        break;
      case 'cs':
      case 'sk':
          _func = function(n)
          {
            return (n === 1) ? 0 : (((n >= 2) && (n <= 4)) ? 1 : 2);
          };
        break;
      case 'ga':
          _func = function(n)
          {
            return (n === 1) ? 0 : ((n === 2) ? 1 : 2);
          };
        break;
      case 'lt':
          _func = function(n)
          {
            return ((n % 10 === 1) && (n % 100 !== 11)) ? 0 : (((n % 10 >= 2) && ((n % 100 < 10) || (n % 100 >= 20))) ? 1 : 2);
          };
        break;
      case 'sl':
          _func = function(n)
          {
            return (n % 100 === 1) ? 0 : ((n % 100 === 2) ? 1 : (((n % 100 === 3) || (n % 100 === 4)) ? 2 : 3));
          };
        break;
      case 'mk':
          _func = function(n)
          {
            return ((n % 10 === 1) ? 0 : 1);
          };
        break;
      case 'mt':
          _func = function(n)
          {
            return (n === 1) ? 0 : (((n === 0) || ((n % 100 > 1) && (n % 100 < 11))) ? 1 : (((n % 100 > 10) && (n % 100 < 20)) ? 2 : 3));
          };
        break;
      case 'lv':
          _func = function(n)
          {
            return (n === 0) ? 0 : (((n % 10 === 1) && (n % 100 !== 11)) ? 1 : 2);
          };
        break;
      case 'pl':
          _func = function(n)
          {
            return (n === 1) ? 0 : (((n % 10 >= 2) && (n % 10 <= 4) && ((n % 100 < 12) || (n % 100 > 14))) ? 1 : 2);
          };
        break;
      case 'cy':
          _func = function(n)
          {
            return (n === 1) ? 0 : ((n === 2) ? 1 : (((n === 8) || (n === 11)) ? 2 : 3));
          };
        break;
      case 'ro':
          _func = function(n)
          {
            return (n === 1) ? 0 : (((n === 0) || ((n % 100 > 0) && (n % 100 < 20))) ? 1 : 2);
          };
        break;
      case 'ar':
          _func = function(n)
          {
            return (n === 0) ? 0 : ((n === 1) ? 1 : ((n === 2) ? 2 : (((n >= 3) && (n <= 10)) ? 3 : (((n >= 11) && (n <= 99)) ? 4 : 5))));
          };
        break;
      default:
          self.log('TRANSLATE.getPluralFormByLocale('+ is_set +', '+ locale +') - Plural Form for `'+ locale +'` is unknown', 'debug');

          throw 'Plural Form for selected locale is unknown. Locale - '+ locale;
        break;
    }

    if(is_set)
    {
      self.setPluralForms(_func);
    }

    self.log('TRANSLATE.getPluralFormByLocale('+ is_set +', '+ locale +') - result: '+ _func, 'debug');

    return _func;
  };

  this.validateLocaleString = function(locale)
  {
    self.log('TRANSLATE.validateLocaleString('+ locale +') - method called', 'debug');

    if(!self.isVarDefined(locale))
    {
      return false;
    }

	var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var str_len = locale.length;
	var current_char;

    if(str_len !== 2)
    {
      return false;
    }

	for(var i = 0; i < str_len; i++)
    {
      current_char = locale.charAt(i);

      if(chars.indexOf(current_char) === -1)
      {
        self.log('TRANSLATE.validateLocaleString('+ locale +') - result: false', 'debug');

        return false;
      }
	}

    self.log('TRANSLATE.validateLocaleString('+ locale +') - result: true', 'debug');

	return true;
  };

  this.getDebug = function()
  {
    var is_debug = self.is_debug;

    if(!self.isVarDefined(is_debug))
    {
      is_debug = false;
    }

    return self.is_debug;
  };

  this.setDebug = function(is_debug)
  {
    if(!self.isVarDefined(is_debug))
    {
      is_debug = false;
    }

    self.is_debug = is_debug;

    self.initLog();

    return is_debug;
  };

  this.initLog = function()
  {
    var is_debug = self.getDebug();

    if(!is_debug)
    {
      return undefined;
    }

    if(Function.prototype.bind && console && typeof console.log === 'object')
    {
      self.getLogTypes().forEach(function(method)
      {
        console[method] = this.call(console[method], console);
      }, Function.prototype.bind);
    }

    return true;
  };

  this.log = function(message, type)
  {
    if(!self.getDebug())
    {
      return;
    }

    if(!self.isVarDefined(message))
    {
      return;
    }

    var log_types = self.getLogTypes();

    if(typeof type === 'undefined' || $.inArray(type, log_types) === -1)
    {
      type = 'log';
    }

    if(typeof console !== 'undefined' && typeof console[type] === 'function')
    {
      console[type](message);
    }
    else if(!Function.prototype.bind && typeof console !== 'undefined' && typeof console[type] === 'object')
    {
      Function.prototype.call.call(console[type], console, message);
    }
  };

  this.getLogTypes = function()
  {
    return [
      'error',
      'warn',
      'info',
      'debug',
      'log'
    ];
  };

  this.isVarDefined = function(variable)
  {
    return (variable && variable !== null && typeof variable !== 'undefined');
  };
};