import { FormComponentListener } from './form-types';
// import { ValidStatus, ChangedStatus, FieldValidationResult } from './validation/validate';

import { Component } from 'react';
import { Text, TextInput, TextStyle, StyleSheet, View, ViewStyle } from 'react-native';
import { Optional } from '../../model/shared-types';
import { ChangedStatus, FieldValidationResult } from './validation/validate';

export interface FormComponentProps<V, OT = {}> {
    id: string;
    value: V;
    label?: string;
    onChange?: FormComponentListener<V>;
    options?: OT;
    errors?: Optional<string>
    style?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
    errorStyle?: TextStyle;
}

export interface FormComponentState<V> {
    value: V,
    changed: ChangedStatus;
    validationErrors: FieldValidationResult;
}

export type ComponentKinds = 'FormTextComponent' | 'FormReadonlyTextComponent' | 'FormDropdownComponent' | 'FormImageComponent';

export interface FormComponent<V, OT = {}> extends Component<FormComponentProps<V, OT>> {
    componentKind: ComponentKinds;
}