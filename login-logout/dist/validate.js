export var ChangedStatus;
(function (ChangedStatus) {
    ChangedStatus[ChangedStatus["Pristine"] = 0] = "Pristine";
    ChangedStatus[ChangedStatus["Dirty"] = 1] = "Dirty";
})(ChangedStatus || (ChangedStatus = {}));
export var ValidStatus;
(function (ValidStatus) {
    ValidStatus[ValidStatus["Valid"] = 0] = "Valid";
    ValidStatus[ValidStatus["Invalid"] = 1] = "Invalid";
})(ValidStatus || (ValidStatus = {}));
export class FormFieldState {
    constructor(valid, changed) {
        this.valid = valid;
        this.changed = changed;
    }
}
export class Validators {
}
Validators.required = () => (value, field) => {
    if (value.trim().length === 0) {
        throw `The field '${field}' is required`;
    }
};
Validators.pattern = (validationPattern) => (value, field) => {
    if (!validationPattern.test(value)) {
        throw `The field '${field}' does not match pattern '${validationPattern}'`;
    }
};
Validators.len = (min, max) => (value, field) => {
    if (value.length < min) {
        throw `The field '${field}' should be at least ${min} characters long`;
    }
    else if (value.length > max) {
        throw `The field '${field}' should be no more tan ${max} characters long`;
    }
};
//# sourceMappingURL=validate.js.map