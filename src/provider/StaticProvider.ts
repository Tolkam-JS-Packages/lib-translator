import { ILanguageProvider, ITranslatorOptions } from '../types';
import { objectMerge, objectHasProperty } from '@tolkam/lib-utils';
import Translator from '../Translator';

const ROOT_KEY = '';

class StaticProvider implements ILanguageProvider {

    /**
     * @type IMessages
     */
    protected messages: {
        [languageCode: string]: IMessages
    } = {};

    /**
     * @type IOptions
     */
    protected o: IOptions = {
        strict: false,
    };

    /**
     * @param options
     */
    public constructor(options: IOptions = {}) {
        this.o = {...this.o, ...options};
    }

    /**
     * Adds messages
     *
     * @param languageCode
     * @param newMessages
     */
    public add(languageCode: string, newMessages: IMessages): this {
        const messages = this.messages;
        messages[languageCode] = messages[languageCode] || {};

        objectMerge(messages[languageCode], newMessages);

        return this;
    }

    /**
     * @inheritDoc
     */
    public hasLanguage(languageCode: string): boolean {
        return this.messages.hasOwnProperty(languageCode);
    }

    /**
     * @inheritDoc
     */
    public getMessage(languageCode: string, messageCode: string): string | null {
        let found = messageCode
            .split(Translator.pathSeparator)
            .reduce((message, k) => (
                message != null && objectHasProperty(message, k)
                    ? message[k]
                    : null
                ), this.messages[languageCode] as any);

        if(found != null && objectHasProperty(found, ROOT_KEY)) {
            found = found[ROOT_KEY];

        }

        if(found == null && this.o.strict) {
            throw new Error(
                `No translation found at "${messageCode}" path for "${languageCode}" language`
            );
        }

        return found;
    }
}

interface IOptions {
    strict?: boolean;
}

export interface IMessages {
    [code: string]: string | IMessages;
}

export default StaticProvider;
