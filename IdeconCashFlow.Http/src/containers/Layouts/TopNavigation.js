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


import { Flag } from '../../components/common';
import { store } from '../../index';
import { setLocale } from '../../redux/modules/locale';

class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    languageChanger = lang => {
        store.dispatch(setLocale(lang));
    };

    userLogout = () => {
        store.dispatch() // Logout işlemi yaptırılacak
    }

    render() {
        const { lang } = this.props;
        return (
            <div className="navbar navbar-expand-md navbar-dark  content-boxed">
                <div className="navbar-brand wmin-0 mr-5">
                    <a href="index.html" className="d-inline-block">
                        asdadas
                </a>
                </div>
                <div className="d-md-none">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-mobile">
                        <i className="icon-tree5"></i>
                    </button>
                </div>
                <div className="collapse navbar-collapse">
                    
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
                                <FormattedMessage id="login.username" defaultMessage="Kullanıcı Adı" />
                            </DropdownToggle>
                                <DropdownMenu style={{ width: '10px' }}>
                                    <DropdownItem >
                                        <FormattedMessage id="login.logout" defaultMessage="Çıkış Yap" />
                                </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}



TopNavigation.propTypes = {
    lang: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    lang: state.locale.lang,
});

const mapDispatchToProps = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TopNavigation);
