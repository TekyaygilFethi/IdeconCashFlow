import React, { Component } from 'react';


class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="page-content pt-20">
                <div className="content-wrapper">
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;



