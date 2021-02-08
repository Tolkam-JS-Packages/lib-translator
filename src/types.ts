export interface ILanguageProvider {

    /**
     * Tells if provider has requested language
     *
     * @param languageCode
     */
    hasLanguage: (languageCode: string) => boolean;

    /**
     * Gets message by code
     *
     * @param languageCode
     * @param messageCode
     */
    getMessage: (languageCode: string, messageCode: string) => string | null;
}

export interface ITranslatorOptions {
    fallbackToCode?: boolean;
}

export interface IMessageParams {
    [name: string]: string | number
}
