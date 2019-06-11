import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Field } from 'react-final-form';
import { TextField, Checkbox, Radio, } from 'final-form-material-ui';
import {
  Typography,
  Paper,
  Link,
  Grid,
  Button,
  CssBaseline,
  RadioGroup,
  Select,
  FormLabel,
  MenuItem,
  FormGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormControlProps,
  InputLabel
} from '@material-ui/core';
import PropTypes from "prop-types";
import AutoComponentSelect from './common/AutoComponentSelect'

const validate = values => {
  const errors = {};
  if (!values.flowDirection) {
    errors.flowDirection = 'Reasdasdsquired';
  }
  if (!values.lastName) {
    errors.lastName = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  }
  return errors;
};

const renderSelectField = ({
  input: { name, value, onChange, ...restInput },
  meta,
  label,
  options,
  formControlProps,
  ...rest
}) => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

  return (
    <FormControl fullWidth {...formControlProps} error={showError}>
      <InputLabel htmlFor={name}>{label}</InputLabel>

      <AutoComponentSelect
        {...rest}
        fullWidth
        name={name}
        onChange={onChange}
        inputProps={restInput}
        value={value}
        options={options}
      />

      {showError &&
        <FormHelperText>{meta.error || meta.submitError}</FormHelperText>
      }
    </FormControl>
  )
}

const FormFields = props => {
  const { onSubmit, flowDirectionOptions,currencyOption } = props;

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ employed: true, stooge: 'larry' }}
      validate={validate}
      render={({ handleSubmit, reset, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className="card-header header-elements-inline">
            <h6 className="card-title">Custom background</h6>
            <div className="header-elements">
              <div className="list-icons">
                <i className="fas fa-eraser" />
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-sm-6">
                <Field
                  label="Akış Yönü"
                  type="select"
                  name="flowDirection"
                  component={renderSelectField}
                  options={flowDirectionOptions}
                />
              </div>
              <div className="col-sm-6">
                <Field
                  label="Para birimi"
                  type="select"
                  name="currency"
                  component={renderSelectField}
                  options={currencyOption}
                />
              </div>              
            </div>
            <div>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                >
                  Submit
                          </Button>
              </div>
          </div>
        </form>
      )}
    />
  );
}





















// const onSubmit = async values => {
//     const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//     await sleep(300);
//     window.alert(JSON.stringify(values, 0, 2));
// };




// function App() {
//     return (
//         <Form
//             onSubmit={onSubmit}
//             initialValues={{ employed: true, stooge: 'larry' }}
//             validate={validate}
//             render={({ handleSubmit, reset, submitting, pristine, values }) => (
//                 <form onSubmit={handleSubmit} noValidate>
//                     <Paper style={{ padding: 16 }}>
//                         <Grid container alignItems="flex-start" spacing={8}>
//                             <Grid item xs={6}>
//                                 <Field
//                                     fullWidth
//                                     required
//                                     name="firstName"
//                                     component={TextField}
//                                     type="text"
//                                     label="First Name"
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <Field
//                                     fullWidth
//                                     required
//                                     name="lastName"
//                                     component={TextField}
//                                     type="text"
//                                     label="Last Name"
//                                 />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Field
//                                     name="email"
//                                     fullWidth
//                                     required
//                                     component={TextField}
//                                     type="email"
//                                     label="Email"
//                                 />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <FormControlLabel
//                                     label="Employed"
//                                     control={
//                                         <Field
//                                             name="employed"
//                                             component={Checkbox}
//                                             type="checkbox"
//                                         />
//                                     }
//                                 />
//                             </Grid>
//                             <Grid item>
//                                 <FormControl component="fieldset">
//                                     <FormLabel component="legend">Best Stooge</FormLabel>
//                                     <RadioGroup row>
//                                         <FormControlLabel
//                                             label="Larry"
//                                             control={
//                                                 <Field
//                                                     name="stooge"
//                                                     component={Radio}
//                                                     type="radio"
//                                                     value="larry"
//                                                 />
//                                             }
//                                         />
//                                         <FormControlLabel
//                                             label="Moe"
//                                             control={
//                                                 <Field
//                                                     name="stooge"
//                                                     component={Radio}
//                                                     type="radio"
//                                                     value="moe"
//                                                 />
//                                             }
//                                         />
//                                         <FormControlLabel
//                                             label="Curly"
//                                             control={
//                                                 <Field
//                                                     name="stooge"
//                                                     component={Radio}
//                                                     type="radio"
//                                                     value="curly"
//                                                 />
//                                             }
//                                         />
//                                     </RadioGroup>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item>
//                                 <FormControl component="fieldset">
//                                     <FormLabel component="legend">Sauces</FormLabel>
//                                     <FormGroup row>
//                                         <FormControlLabel
//                                             label="Ketchup"
//                                             control={
//                                                 <Field
//                                                     name="sauces"
//                                                     component={Checkbox}
//                                                     type="checkbox"
//                                                     value="ketchup"
//                                                 />
//                                             }
//                                         />
//                                         <FormControlLabel
//                                             label="Mustard"
//                                             control={
//                                                 <Field
//                                                     name="sauces"
//                                                     component={Checkbox}
//                                                     type="checkbox"
//                                                     value="mustard"
//                                                 />
//                                             }
//                                         />
//                                         <FormControlLabel
//                                             label="Salsa"
//                                             control={
//                                                 <Field
//                                                     name="sauces"
//                                                     component={Checkbox}
//                                                     type="checkbox"
//                                                     value="salsa"
//                                                 />
//                                             }
//                                         />
//                                         <FormControlLabel
//                                             label="Guacamole 🥑"
//                                             control={
//                                                 <Field
//                                                     name="sauces"
//                                                     component={Checkbox}
//                                                     type="checkbox"
//                                                     value="guacamole"
//                                                 />
//                                             }
//                                         />
//                                     </FormGroup>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Field
//                                     fullWidth
//                                     name="notes"
//                                     component={TextField}
//                                     multiline
//                                     label="Notes"
//                                 />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Field
//                                     fullWidth
//                                     name="city"
//                                     component={Select}
//                                     label="Select a City"
//                                     formControlProps={{ fullWidth: true }}
//                                 >
//                                     <MenuItem value="London">London</MenuItem>
//                                     <MenuItem value="Paris">Paris</MenuItem>
//                                     <MenuItem value="Budapest">
//                                         A city with a very long Name
//                     </MenuItem>
//                                 </Field>
//                             </Grid>

//                             <Grid item style={{ marginTop: 16 }}>
//                                 <Button
//                                     type="button"
//                                     variant="contained"
//                                     onClick={reset}
//                                     disabled={submitting || pristine}
//                                 >
//                                     Reset
//                   </Button>
//                             </Grid>
//                             <Grid item style={{ marginTop: 16 }}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     type="submit"
//                                     disabled={submitting}
//                                 >
//                                     Submit
//                   </Button>
//                             </Grid>
//                         </Grid>
//                     </Paper>
//                     <pre>{JSON.stringify(values, 0, 2)}</pre>
//                 </form>
//             )}
//         />
//     );
// }


export default FormFields;