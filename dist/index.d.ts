export type CnpjParts = {
    raiz: string;
    ordem: string;
    dv: string;
};
export declare function normalize(value: string): string;
export declare function isFormatted(value: string): boolean;
export declare function format(value: string): string;
export declare function split(value: string): CnpjParts;
export declare function charValue(char: string): number;
export declare function calculateCheckDigits(base: string): string;
export declare function generate(base: string): string;
export declare function validate(value: string): boolean;
export declare function assertValid(value: string): string;
