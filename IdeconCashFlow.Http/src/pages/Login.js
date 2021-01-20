import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { auth } from '../redux/modules/login';
import { authControl } from '../utils/helper';
import { Redirect } from 'react-router-dom';
import BlockUi from 'react-block-ui';
import { FormattedMessage } from "react-intl";
import 'react-block-ui/style.css';

const validate = values => {
    const errors = {};
    if (!values.username) {
        errors.username = 'Lütfen kullanıcı adınızı giriniz!';
    }
    if (!values.password) {
        errors.password = 'Lütfen şifrenizi giriniz!';
    }
    return errors;
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            redirectToReferrer: false,
            loading: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(nextProps) {
        const result = {};
        if (!authControl()) {
            result.redirectToReferrer = false;
        } else {

            result.redirectToReferrer = true;
        }

        result.loading = nextProps.authentication.isFetching;
        return { ...result };
    }

    handleSubmit = e => {
        this.props.auth(e);
    }

    render() {

        let locationState = this.props.location.state;
        const { redirectToReferrer, loading } = this.state;

        if (!locationState) {
            locationState = {
                from: {
                    pathname: `/`,
                },
            };
        }

        if (redirectToReferrer) {
            return <Redirect to={locationState.from} />;
        }

        return (
            <div className="content d-flex justify-content-center align-items-center">
                <Form
                    onSubmit={this.handleSubmit}
                    validate={validate}
                    render={({ handleSubmit, reset, submitting, pristine, values }) => (
                        <BlockUi tag="form" blocking={loading} className="login-form" onSubmit={handleSubmit} noValidate>
                            <div className="card mb-0">
                                <div className="card-body">
                                    <div className="text-center mb-3">
                                        <i className="icon-reading icon-2x text-slate-300 border-slate-300 border-3 rounded-round p-3 mb-3 mt-1"></i>
                                        <h5 className="mb-0"><FormattedMessage id="loginAccount" /></h5>
                                        <span className="d-block text-muted"><FormattedMessage id="loginInfo" /></span>
                                    </div>

                                    <div className="form-group form-group-feedback form-group-feedback-left">
                                        <Field
                                            fullWidth
                                            name="username"
                                            component={TextField}
                                            type="text"
                                            label="Kullanıcı Adı"
                                        />
                                    </div>

                                    <div className="form-group form-group-feedback form-group-feedback-left">
                                        <Field
                                            fullWidth
                                            name="password"
                                            component={TextField}
                                            type="password"
                                            label="Şifre"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between align-items-center bg-teal-400 border-top-0" style={{ position: 'relative' }}>
                                <p className="legitRipple" />
                                <button
                                    type="submit"
                                    className="btn btn-outline bg-white text-white border-white border-2 legitRipple"
                                >
                                    <FormattedMessage id="signIn" /> <i className="icon-paperplane ml-2" />
                                </button>
                            </div>
                        </BlockUi>
                    )} />
            </div>
        )
    }
}

Login.propTypes = {
    auth: PropTypes.func.isRequired,
}
Login.defaultProps = {
    location: { from: { pathname: '/' } },
};

const mapStateToProps = state => ({
    authentication: state.auth
});
const mapDispatchToProps = {
    auth
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);


