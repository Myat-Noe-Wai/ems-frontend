import React, { Component } from 'react'

class FooterComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return (
            <div>
                <footer className="footer" style={{background: "#343A40", height: "55px", textAlign: "center"}}>
                    <span className="text-muted">All rights reserved</span>
                </footer>               
            </div>
        )
    }
}

export default FooterComponent