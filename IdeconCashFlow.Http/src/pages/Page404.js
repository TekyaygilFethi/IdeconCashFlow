import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class Page404 extends Component {
    render() {
        return (
            <div className="content d-flex justify-content-center align-items-center">

                <div className="flex-fill">

                    <div className="text-center mb-3">
                        <h1 className="error-title">404</h1>
                        <h5><FormattedMessage id="page404" /></h5>
                    </div>

                    <div className="row">
                        <div className="col-xl-4 offset-xl-4 col-md-8 offset-md-2">
                            <div className="row">
                                <div className="col-sm-12">

                                    <Link to="/">
                                        <div className="card-footer d-flex justify-content-between align-items-center bg-teal-400 border-top-0">
                                            <p className="legitRipple" />
                                            <button
                                                type="submit"
                                                className="btn btn-outline bg-white text-white border-white border-2 legitRipple"
                                            >
                                                <FormattedMessage id="goBackMainPage" /> <i className="icon-paperplane ml-2" />
                                            </button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Page404.propTypes = {
}
Page404.defaultProps = {
};

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Page404);


