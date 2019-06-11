import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

const FormFields = props => {
    const {
        handleSubmit,
    } = props;
    return (
        <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" component="input" type="text" value=""/>
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" component="input" type="text"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
};

export default reduxForm({
        form: 'FormFields'
    })(FormFields);
