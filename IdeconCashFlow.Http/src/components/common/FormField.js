import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import ReactQuill from 'quill';
import Select from 'react-select';
import moment from 'moment';

import 'quill/dist/quill.snow.css';

import { FormGroup, Input, InputGroup, Label } from 'reactstrap';
import DatePicker from 'react-datepicker';
import NumericInput from 'react-numeric-input';

let newId = 0;

const TextInput = props => (
  <InputGroup size="sm">
    {props.addonLeft && (
      <div className="input-group-prepend">
        <span className="input-group-text">
          {typeof props.addonLeft === 'boolean' ? <i className={props.icon} /> : props.addonLeft}
        </span>
      </div>
    )}

    <Input
      {..._.omit(props, ['error', 'hasRequired', 'value', 'addonLeft', 'addonRight', 'icon', 'id'])}
      value={props.value || ''}
      onChange={evt => {
        props.onChange(evt.target.value);
      }}
      className={`${props.error && 'inputError'} ${props.compact && 'compact'}`}
    />

    {props.addonRight && (
      <div className="input-group-append">
        <span className={`input-group-text ${props.compact && 'thin'}`}>
          {typeof props.addonRight === 'boolean' ? <i className={props.icon} /> : props.addonRight}
        </span>
      </div>
    )}
  </InputGroup>
);
TextInput.propTypes = {
  icon: PropTypes.string,
  addonLeft: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  addonRight: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  error: PropTypes.string,
};
TextInput.defaultProps = {
  icon: '',
  addonLeft: null,
  addonRight: null,
  name: '',
  value: '',
  error: '',
};

const Numeric = props => {
  return (
    <div className="NumericInput thin">
      <NumericInput
        {..._.omit(props, ['error', 'hasRequired', 'value', 'id'])}
        min={props.min}
        max={props.max}
        onChange={count => props.onChange(count)}
        value={props.value}
        className={`${props.error && 'inputError'}  `}
      />
    </div>
  );
};
TextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  error: PropTypes.string,
};
TextInput.defaultProps = {
  name: '',
  value: '',
  error: '',
};

const SelectBox = props => (
  <Select
    {..._.omit(props, ['error', 'hasRequired'])}
    autoBlur
    isClearable={props.isClearable}
    isMulti={props.isMulti}
    isLoading={props.loading}
    placeholder={props.placeholder || 'Seçim Yapın..'}
    isDisabled={props.disabled}
    onChange={value => props.onChange(value)}
    removeSelected={props.removeSelected}
    name={props.name.toString()}
    noOptionsMessage = {props.noOptionsMessage}
  />
);

SelectBox.propTypes = {
  placeholder: PropTypes.string,
  noOptionsMessage:PropTypes.func,
  isClearable: PropTypes.bool,
  isMulti: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  addonLeft: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  addonRight: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
};
SelectBox.defaultProps = {
  isClearable: false,
  isMulti: false,
  disabled: false,
  loading: false,
  removeSelected:{},
  options: [],
  addonLeft: null,
  addonRight: null,
  name: '',
  defaultValue: {},
  error: '',
};

const RichTextArea = props => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction
      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['clean'], // remove formatting button
    ],
  };

  return (
    <ReactQuill
      {..._.omit(props, ['error', 'hasRequired', 'value', 'addonLeft', 'addonRight'])}
      theme="snow"
      modules={modules}
      value={props.value}
      onChange={value => {
        props.onChange(value);
      }}
    />
  );
};

RichTextArea.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  error: PropTypes.string,
};
RichTextArea.defaultProps = {
  placeholder: '',
  name: '',
  value: '',
  error: '',
};

const DateTimePicker = props => (
  <InputGroup>
    {props.addonLeft && (
      <div className="input-group-prepend">
        <span className="input-group-text">
          {typeof props.addonLeft === 'boolean' ? <i className={props.icon} /> : props.addonLeft}
        </span>
      </div>
    )}

    <DatePicker
      calendarClassName="sadalCalendar"
      dateFormat="DD.MM.YYYY"
      selected={props.value || moment()}
      onChange={date => props.onChange(date, 2)}
      autocomplete="off"
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      disabled={props.disabled}
      minDate={props.minDate}
      maxDate={props.maxDate}
      className={`${props.className}
      ${props.addonLeft && 'bdr-l-0 bd-l-0'}
      ${props.addonRight && 'bdr-r-0 bd-r-0'}
        form-control
        ${props.error && 'inputError'}`}
    />

    {props.addonRight && (
      <div className="input-group-prepend">
        <span className="input-group-text">
          {typeof props.addonRight === 'boolean' ? <i className={props.icon} /> : props.addonRight}
        </span>
      </div>
    )}
  </InputGroup>
);

DateTimePicker.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  minDate: PropTypes.func,
  maxDate: PropTypes.func,
  value: PropTypes.func,
  disabled: PropTypes.bool,
  addonLeft: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  addonRight: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};
DateTimePicker.defaultProps = {
  error: 'form-control',
  className: '',
  minDate: '',
  maxDate: '',
  value: moment(),
  disabled: false,
  addonLeft: null,
  addonRight: null,
};

const Textarea = props => (
  <InputGroup size="sm">
    <Input
      type="textarea"
      rows="4"
      {..._.omit(props, ['error', 'hasRequired', 'value', 'addonLeft', 'addonRight'])}
      value={props.value}
      onChange={evt => {
        props.onChange(evt.target.value);
      }}
    />
  </InputGroup>
);
Textarea.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  error: PropTypes.string,
};
Textarea.defaultProps = {
  placeholder: '',
  name: '',
  value: '',
  error: '',
};

const FormField = props => {
  let Component;

  switch (props.type) {
    case 'textarea':
      Component = Textarea;
      break;
    case 'richTextArea':
      Component = RichTextArea;
      break;
    case 'select':
      Component = SelectBox;
      break;

    case 'date':
      Component = DateTimePicker;
      break;
    case 'numeric':
      Component = Numeric;
      break;

    default:
      Component = TextInput;
  }

  const inputProps = _.omit(props, ['statusColor', 'iconAlign', 'contClass']);
  const name = props.name ? props.name : (newId += 1);
  const id = props.id || props.name;
  inputProps.id = id;
  inputProps.name = name;



  return (
    <FormGroup className={`${props.contClass} ${props.compact && 'm-b-0'}`}>
      {props.label && <Label className={props.compact && 'm-b-0'}>{props.label}</Label>}
      <Component {...inputProps} />
      {props.error && <span className="errorText">{props.error}</span>}
    </FormGroup>
  );
};

FormField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  contClass: PropTypes.string,
};
FormField.defaultProps = {
  name: '',
  id: '',
  label: '',
  error: '',
  contClass: '',
};

export default FormField;
