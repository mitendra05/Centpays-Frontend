import React, { Component } from 'react'

//Components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export class setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebaropen: true,
            token: this.getCookie("token"),
            userRole: this.getCookie("role"),
            company_name: this.getCookie("company_name"),
        };
    }

    getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    componentDidMount() {

    }

    render() {
        const {  } = this.state;
        return (
            <>
                <Header />
                <Sidebar />
                <div
                    className={`main-screen ${this.state.sidebaropen
                            ? "collapsed-main-screen"
                            : "expanded-main-screen"
                        }  `}
                >
                    <div className='merchantSetting'>
                        <div className='merchantSetting-left'>
                            <ul>
                                <li className='list-heading'>GENRAL</li>
                                <div className='setting-section-block'>
                                    <li>Profile</li>
                                    <li>Integration</li>
                                </div>
                                <li className='list-heading'>ACCESS CONTROL</li>
                                <div className='setting-section-block'>
                                    <li>Member</li>
                                    <li>Access Roles</li>
                                </div>
                            </ul>
                        </div>
                        <div className='merchantSetting-right'>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default setting