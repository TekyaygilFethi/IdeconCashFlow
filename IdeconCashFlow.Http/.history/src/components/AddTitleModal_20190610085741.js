import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Button,Switch} from '@material-ui/core/index';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { FormattedMessage } from "react-intl";

import {saveTitle} from '../redux/modules/saveTitle';

class AddTitleModal extends Component{
    constructor(props){
        super(props);
        this.state={}
    }

    render(){

        console.log(this.props);
        debugger;
        return(
            <>
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                  <FormattedMessage id="addTitleModal.dueDateChooseDefinition"/>
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                value={this.props.title}
                label="Başlık"
                type="email"
                fullWidth
              />
              <label>Vade İlişkili mi ?</label>
               <Switch
                    checked={true}
                    value=""
                    color="primary"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Subscribe
              </Button>
            </DialogActions>
            </>
        )
    }
}



AddTitleModal.propTypes = {
    saveTitle: PropTypes.func.isRequired,
};
AddTitleModal.defaultProps = {};

const mapStateToProps = state => ({
    title: state.title,
});
const mapDispatchToProps = {
    saveTitle,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddTitleModal);