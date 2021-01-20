import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { FormattedMessage } from "react-intl";

import logo from '../../assets/idecon-logo.png';
import { Flag } from '../../components/common';
import { store } from '../../index';
import { setLocale } from '../../redux/modules/locale';
import { logout } from '../../redux/modules/logout';
import { Link } from 'react-router-dom'



class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.handlePush = this.handlePush.bind(this);
    }

    languageChanger = lang => {
        store.dispatch(setLocale(lang));
    };

    logout = () => {
        this.props.logout(this.props.location)
    }

    handlePush() {
        this.props.history.push('/');
    }

    render() {
        const { lang, loggedUser } = this.props;
        return (
            <div className="navbar navbar-expand-md navbar-dark  content-boxed">
                <div className="navbar-brand wmin-0">
                    <Link to="/">
                        <img src={logo} alt="idecon" />
                    </Link>
                </div>
                <div className="d-md-none">
                    <ul className="nav navbar-right">
                        <li className="dropdown language-switch">
                            <UncontrolledDropdown setActiveFromChild>
                                <DropdownToggle tag="a" className="nav-link" caret>
                                    <Flag name={lang} />
                                </DropdownToggle>
                                <DropdownMenu style={{ width: '10px' }}>
                                    <DropdownItem active={lang === 'tr'} onClick={() => this.languageChanger('tr')}>
                                        <Flag name="tr" /> Türkçe
                                    </DropdownItem>
                                    <DropdownItem active={lang === 'en'} onClick={() => this.languageChanger('en')}>
                                        <Flag name="us" /> English
                            </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </li>

                        <li className="dropdown dropdown-user">
                            <UncontrolledDropdown setActiveFromChild>
                                <DropdownToggle tag="a" className="nav-link" caret>
                                    {loggedUser.Username}
                                </DropdownToggle>
                                <DropdownMenu style={{ width: '10px' }}>
                                    <DropdownItem onClick={() => this.logout()}>
                                        <FormattedMessage id="login.logout" defaultMessage="Çıkış Yap" />
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </li>
                    </ul>
                </div>


                <div className="collapse navbar-collapse" id="navbar-mobile">

                    <span className="ml-md-3 mr-md-auto"></span>
                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown language-switch">
                            <UncontrolledDropdown setActiveFromChild>
                                <DropdownToggle tag="a" className="nav-link" caret>
                                    <Flag name={lang} />
                                </DropdownToggle>
                                <DropdownMenu style={{ width: '10px' }}>
                                    <DropdownItem active={lang === 'tr'} onClick={() => this.languageChanger('tr')}>
                                        <Flag name="tr" /> Türkçe
                                    </DropdownItem>
                                    <DropdownItem active={lang === 'en'} onClick={() => this.languageChanger('en')}>
                                        <Flag name="us" /> English
                            </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </li>

                        <li className="dropdown dropdown-user">
                            <UncontrolledDropdown setActiveFromChild>
                                <DropdownToggle tag="a" className="nav-link" caret>
                                    {loggedUser.Username}
                                </DropdownToggle>
                                <DropdownMenu style={{ width: '10px' }}>
                                    <DropdownItem onClick={() => this.logout()}>
                                        <FormattedMessage id="login.logout" defaultMessage="Çıkış Yap" />
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </li>
                    </ul>
                </div>
            </div >
        )
    }
}



TopNavigation.propTypes = {
    lang: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    loggedUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
    lang: state.locale.lang,
    loggedUser: state.loggedUser,
});

const mapDispatchToProps = {
    logout
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TopNavigation);
