[Translate with Plural support](http://staticall.github.com/jquery-translate-plural/)
=================

Very simple javascript class for translation with plural support.

To view demonstration, check out http://staticall.github.com/jquery-translate-plural/


Dependencies
------------

+ jQuery (any version, which support $.inArray and $.parseJSON)

API
---

+ TRANSLATE.init(locale_or_phrases, phrases)

'locale_or_phrases': locale in format 'ru', 'en-US' or 'de_DE' -OR- JSON with 'locale' key for current locale and 'phrases', 'strings' or 'messages' key for phrases

'phrases': JSON of phrases. Used only if first attribute is not JSON

Initialize current class. Throws exception if some data is missing



+ TRANSLATE.setLocale(locale)

'locale': locale in format 'ru', 'en-US' or 'de_DE'



+ TRANSLATE.setPluralForms(plural_form)

'plural_form': Function for plural form calculation. Should look something like this:
function(n)
{
  return (n == 1 ? 0 : 1);
}

Set plural form calculation function



+ TRANSLATE.setPhrases(phrases, locale) || TRANSLATE.setMessages(messages, locale) || TRANSLATE.setStrings(strings, locale)

'phrases' || 'messages' || 'strings': JSON with phrases

'locale': target locale for phrases. If no locale defined, will be used default, taken by TRANSLATE.getLocale() function

Set phrases, used for translation


Bug tracker
-----------

Have a bug? Post it on GitHub!

https://github.com/staticall/jquery-translate-plural/issues


Authors
-------

**staticall**

+ http://twitter.com/staticall
+ http://github.com/staticall