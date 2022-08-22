import { capitalize } from './utils.js';
import { ValidStatus, ChangedStatus, } from "./validate.js";
export class FormTextComponent {
    constructor(id, value, initialValue = '', multiline = false, label = capitalize(id), property = id, validators, hidden = false, valid = ValidStatus.Invalid, changed = ChangedStatus.Pristine) {
        this.id = id;
        this.value = value;
        this.initialValue = initialValue;
        this.multiline = multiline;
        this.label = label;
        this.property = property;
        this.validators = validators;
        this.hidden = hidden;
        this.valid = valid;
        this.changed = changed;
    }
    reset() {
        this.value = this.initialValue;
    }
    validate() {
        const errors = [];
        if (!this.validators)
            return [];
        if (Array.isArray(this.validators)) {
            for (const validator of this.validators) {
                try {
                    validator(this.value, this.id);
                }
                catch (err) {
                    errors.push(err);
                }
            }
        }
        else {
            try {
                this.validators(this.value, this.id);
            }
            catch (err) {
                errors.push(err);
            }
        }
        return errors;
    }
    render() {
        const validationErrors = this.validate();
        return this.multiline ?
            `
      <div class="input-field col s12">
          <textarea id="${this.id}" name="${this.id}" type="text" 
              class="materialize-textarea validate ${validationErrors ? 'invalid' : 'valid'}" data-property="${this.property}">${this.value}</textarea>
          <label for="${this.id}">${this.label}</label>
          <span class="helper-text" data-error="${this.validate().join(', ')}"></span>
      </div>
      `
            : this.hidden ?
                `
          <input id="${this.id}" name="${this.id}" hidden data-property="${this.property}" >
      `
                :
                    `
      <div class="input-field col s12">
          <input id="${this.id}" name="${this.id}" data-property="${this.property}" type="text" class="validate ${validationErrors ? 'invalid' : 'valid'}"
              value="${this.value}">
          <label for="${this.id}">${this.label}</label>
          <span class="helper-text" data-error="${this.validate().join(', ')}"></span>
      </div>
      `;
    }
}
export class FormWidget {
    constructor(formId, elements, intitialValue, validationConfig, handleSubmit, valid = ValidStatus.Invalid, changed = ChangedStatus.Pristine) {
        this.formId = formId;
        this.elements = elements;
        this.intitialValue = intitialValue;
        this.validationConfig = validationConfig;
        this.handleSubmit = handleSubmit;
        this.valid = valid;
        this.changed = changed;
        this.reset = () => {
            for (const elemId in this.elements) {
                this.elements[elemId].reset();
            }
        };
        this.fieldChanged = (event) => {
            const target = event.target;
            const value = event.target.value;
            if (typeof value !== 'undefined') {
                this.elements[target.getAttribute('data-property')].value = value;
            }
        };
    }
    validate() {
        const result = {};
        this.valid = ValidStatus.Valid;
        for (const elemId in this.elements) {
            const fieldErrors = this.elements[elemId].validate();
            if (fieldErrors && fieldErrors.length > 0) {
                result[elemId] = fieldErrors;
                this.valid = ValidStatus.Invalid;
            }
        }
        return result;
    }
    getFormSnapshot() {
        const result = Object.assign({}, this.intitialValue);
        for (const elemId in this.elements) {
            const elemValue = this.elements[elemId].value;
            if (elemId in this.elements) {
                switch (typeof result[elemId]) {
                    case 'string':
                        result[elemId] = elemValue;
                        break;
                    case 'number':
                        result[elemId] = (!Number.isNaN(parseFloat(elemValue)) ? parseFloat(elemValue) : undefined);
                        break;
                    case 'boolean':
                        result[elemId] = new Boolean(elemValue);
                        break;
                    case 'undefined':
                        result[elemId] = undefined;
                        break;
                    case 'object':
                        if (Array.isArray(result[elemId])) {
                            result[elemId] = elemValue.split(/\W+/);
                        }
                        else {
                            throw Error("Unexpected object field type when getting form snapshot");
                        }
                        break;
                    default:
                        throw Error("Unexpected field type when getting form snapshot");
                }
            }
        }
        return result;
    }
    render() {
        let fieldsMarkup = '';
        for (const elemId in this.elements) {
            fieldsMarkup += `<div class="row">${this.elements[elemId].render()}</div>`;
        }
        return ` 
      <form id="${this.formId}" class="col s12">
          ${fieldsMarkup}
          <button class="btn waves-effect waves-light" type="submit" name="submit">Submit
              <i class="material-icons right">send</i>
          </button>
          <button id="${this.formId}-reset-button" class="btn waves-effect waves-light red lighten-1" type="button">Reset
              <i class="material-icons right">cached</i>
          </button>
      </form>
      `;
    }
    makeInteractive() {
        const formElem = document.getElementById(this.formId);
        formElem.addEventListener('submit', this.handleSubmit);
        const resetButton = document.getElementById(`${this.formId}-reset-button`);
        resetButton.addEventListener('click', this.reset);
        formElem.addEventListener('keyup', this.fieldChanged, true);
    }
}
//# sourceMappingURL=form-builder.js.map