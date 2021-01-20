
import React, { Component } from "react";
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormControlProps,
    InputAdornment,
    Switch
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from "react-intl";

import DialogTitle from '@material-ui/core/DialogTitle';

import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';

import CreatableSelect from "react-select/creatable";
import Select from 'react-select';
import BlockUi from 'react-block-ui';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import _ from 'lodash';

import "moment/locale/en-gb";
import "moment/locale/tr";


export function DatePickerWrapperOnly(props) {
    const {
        input: { name, onChange, value, ...restInput },
        meta,
        format1,
        ...rest
    } = props;
    const showError =
        ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
        meta.touched;

    return (
        <KeyboardDatePicker
            {...rest}
            name={name}
            format={format1}
            helperText={showError ? meta.error || meta.submitError : undefined}
            error={showError}
            inputProps={restInput}
            onChange={onChange}
            value={value === '' ? null : value}
        />
    );
}



export function DatePickerWrapper(props) {
    const {
        input,
        meta,
        onChangeInput,
        inputValue,
        format1,
        ...rest
    } = props;
    const showError =
        ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
        meta.touched;

    if (_.isEmpty(input.value)) {
        input.onChange(inputValue);
    }

    return (
        <KeyboardDatePicker
            {...rest}
            format={format1}
            helperText={showError ? meta.error || meta.submitError : undefined}
            error={showError}
            onChange={e => {
                input.onChange(e);
                if (onChangeInput)
                    onChangeInput(e);
            }}
            value={(inputValue) ? inputValue : input.value}
        />
    );
}



export const renderSelectField = ({
    input,
    meta,
    onChangeInput,
    label,
    options,
    formControlProps,
    ...rest
}) => {
    const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

    return (

        <FormControl fullWidth {...formControlProps} error={showError}>
            <label>{label}</label>
            <Select
                {...rest}
                fullWidth
                label={label}
                onChange={e => {
                    input.onChange(e);
                    if (onChangeInput)
                        onChangeInput(e);
                }}
                options={options}
            />


            {showError &&
                <FormHelperText>{meta.error || meta.submitError}</FormHelperText>
            }
        </FormControl>
    )
}

export const renderCreateSelectField = ({
    input,
    meta,
    label,
    onChangeInput,
    options,
    inputValue,
    formControlProps,
    createOptionPosition,
    formatCreateLabel,
    onCreateOption,
    ...rest
}) => {
    const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;


    if (input.value !== inputValue && !_.isEmpty(inputValue)) {
        input.onChange(inputValue);
    }

    return (
        <FormControl fullWidth {...formControlProps} error={showError}>
            <label>{label}</label>
            <CreatableSelect
                {...rest}
                fullWidth
                value={input.value}
                createOptionPosition={createOptionPosition}
                formatCreateLabel={formatCreateLabel}
                onCreateOption={onCreateOption}
                onChange={(e) => {
                    input.onChange(e)
                    if (onChangeInput)
                        onChangeInput(e);
                }}
                options={options}
            />

            {showError &&
                <FormHelperText>{meta.error || meta.submitError}</FormHelperText>
            }
        </FormControl>
    )
}