import { simpleSprintf, pluralIndex, strtr } from '@tolkam/lib-utils';
import { ILanguageProvider, IMessageParams, ITranslatorOptions } from './types';

const SEP_LEVEL = '.';
const SEP_FORMS = '|';
const SEP_FORM  = ',';

class Translator {

    /**
     * Message code path separator
     */
    static readonly pathSeparator = SEP_LEVEL;

    /**
     * @type ITranslatorOptions
     */
    protected o: ITranslatorOptions = {
        fallbackToCode: false,
    };

    /**
     * @type ILanguageProvider[]
     */
    protected providers: ILanguageProvider[] = [];

    /**
     * @type string
     */
    protected language: string;

    /**
     * @param options
     */
    public constructor(options: ITranslatorOptions = {}) {
        this.o = {...this.o, ...options};
    }

    /**
     * Adds a new language provider
     *
     * @param provider
     */
    public addProvider = (provider: ILanguageProvider): this => {
        this.providers.push(provider);
        return this;
    }

    /**
     * Sets language code to use
     *
     * @param languageCode
     */
    public useLanguage = (languageCode: string): this => {
        if(languageCode.length !== 2) {
            throw new Error(`Language code must be exactly 2 characters long`);
        }

        this.language = languageCode;
        return this;
    }

    /**
     * Gets translated message by given path
     *
     * @param messageCode
     * @param params
     */
    public get = (messageCode: string, params?: IMessageParams): string | null => {
        const lang = this.language;
        let message = this.o.fallbackToCode ? messageCode : null;

        if(lang) {
            const providers = this.getProviders(lang);
            for(const provider of providers) {
                message = provider.getMessage(lang, messageCode) || message;
                if(message !== null) {
                    const matches = message.match(/{.+?}/g);
                    if(params && matches) {
                        message = this.pluralize(message, matches, params);
                    }
                    break;
                }
            }
        } else {
            throw new Error(`No language to use is set`);
        }

        return message;
    }

    /**
     * Gets capable providers
     *
     * @param languageCode
     */
    private getProviders(languageCode: string): ILanguageProvider[] {
        const capable: ILanguageProvider[]  = [];
        this.providers.forEach((p) => {
            if(p.hasLanguage(languageCode)) {
                capable.push(p);
            }
        });

        if(capable.length === 0) {
            throw new Error(`No capable provider found for "${languageCode}" language`);
        }

        return capable;
    }

    /**
     * Applies pluralization rules
     *
     * @param message
     * @param placeholders
     * @param params
     */
    private pluralize(
        message: string,
        placeholders: string[],
        params: IMessageParams
    ): string {
        const map: string[] = [];
        placeholders.forEach((placeholder) => {
            const stripped = placeholder
                .substring(0, placeholder.length - 1)
                .substring(1);
            let [arg, forms] = stripped.split(SEP_FORMS);
            let replacement = params[arg];

            if(forms) {
                const splitForms = forms.split(SEP_FORM);
                const value = params[arg] != null ? params[arg] : '';
                const intCount = Number(value);
                let formIndex = pluralIndex(this.language, intCount);

                if(intCount === 0) {
                    const zeroFormIndex = formIndex + 1;
                    if(splitForms[zeroFormIndex] != null) {
                        formIndex = zeroFormIndex;
                    }
                }

                replacement = simpleSprintf(splitForms[formIndex], value);
            }

            map[placeholder] = replacement;
        });

        return strtr(message, map);
    }
}

export default Translator;
