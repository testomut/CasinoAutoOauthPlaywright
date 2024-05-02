// types/Types.ts
export interface RegistrationData {
    email?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string;
    promoCode?: string;
    agreeToTerms?: boolean;
}

export enum FieldName {
    Email = "email",
    Password = "password",
    RepeatPassword = "repeat_password",
    PhoneNumber = "phoneNumber",
    PromoCode = "promo_code",
    Agree = "agree"
}

export interface PasswordValidation {
    isRequired: boolean,
    containsDigit: boolean,
    noSpaces: boolean,
    hasLowerAndUpper: boolean,
    onlyEnglishChars: boolean,
    minLength: boolean,
    maxLength: boolean
}

export interface OauthData { 
    login: string, 
    password: string 
}

export enum FieldNameLogin {
    Email = "email",
    Password = "password"
}

export interface ProfileData { 
    firstName?: string, 
    lastName?: string,
    birthDate?: string,
    gender?: 'Male' | 'Female',
    documentNumber?: string,
    taxNumber?: string,
}

export interface FullProfileData extends ProfileData {
    email?: string,
    phone?: string,
}