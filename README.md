# tolkam/lib-translator

Translates message codes into human-readable strings.

## Usage

````ts
import { StaticProvider, Translator } from '@tolkam/lib-translator';

const translator = new Translator();
const langProvider = new StaticProvider({
    strict: true,
});

langProvider.add('en', {
    my: {
        code: {
            '': 'Messages: {count}',
            'plural': 'You have {count|%d message,%d messages,no messages}',
        }
    }
});

langProvider.add('ru', {
    my: {
        code: {
            'plural': 'У вас {count|%d сообщение,%d сообщения,%d сообщений,нет сообщений}',
        }
    }
});

translator.addProvider(langProvider);

translator.useLanguage('en');
console.log(translator.get('my.code', {count: 5}));
console.log(translator.get('my.code.plural', {count: 1}));
console.log(translator.get('my.code.plural', {count: 5}));

translator.useLanguage('ru');
console.log(translator.get('my.code.plural', {count: 1}));
console.log(translator.get('my.code.plural', {count: 3}));
console.log(translator.get('my.code.plural', {count: 5}));
````

## Documentation

The code is rather self-explanatory and API is intended to be as simple as possible. Please, read the sources/Docblock if you have any questions. See [Usage](#usage) for quick start.

## License

Proprietary / Unlicensed 🤷
