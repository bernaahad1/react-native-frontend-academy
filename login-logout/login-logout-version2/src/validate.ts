
export type ValidationConfig<T> = {
    [P in keyof T]?: Validator | Validator[]
}

export type ValidationResult<T> = {
    [P in keyof T]?: string[]
}

export enum ChangedStatus{
  Pristine,
  Dirty,
}
export enum ValidStatus{
  Valid,
  Invalid,
}

export class FormFieldState{
  constructor(
    public valid: ValidStatus,
    public changed: ChangedStatus
  ) {
    
  }
}

export type FormState<T> = {
  [P in keyof T]?: FormFieldState
}

export type Validator = (value: string, field: string) => void;

export type ValidatorFactory = (...args: any) => Validator

//validator
export class Validators {
    static required: ValidatorFactory = () => (value: string, field: string) => {
        if(value.trim().length === 0) {
            throw `The field '${field}' is required`
        }
    }
    static pattern: ValidatorFactory = (validationPattern: RegExp) => (value: string, field: string) => {
        if(!validationPattern.test(value)) {
            throw `The field '${field}' does not match pattern '${validationPattern}'`
        }
    }
    static len: ValidatorFactory = (min: number, max: number) => (value: string, field: string) => {
        if(value.length < min) {
            throw `The field '${field}' should be at least ${min} characters long`
        } else if (value.length > max) {
            throw `The field '${field}' should be no more tan ${max} characters long`
        }
    }
}