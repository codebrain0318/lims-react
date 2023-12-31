import React, { Component } from 'react';
import toast from 'react-hot-toast';
import { logout } from '../../slices/auth';
import axiosFetch from '../../utils/axiosFetch';

const formats = ['MM.DD.YYYY', 'DD.MM.YYYY', 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD', 'YYYY-DD-MM', 'MM-DD-YYYY']

class AdminSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sidemenu: 1,
            date_format: 'DD.MM.YYYY'
        }
    }

    componentDidMount() {
        axiosFetch.get("/api/settings/date_format")
            .then(res => {
                this.setState({ date_format: res.data.date_format })
            }).catch(err => {
                if (err.response.status === 401) {
                    // logout();
                } else {
                    console.log(err.response.data)
                }
            });
    }

    handleChangeFormat = (item) => {
        axiosFetch.post('/api/settings/date_format', { format: item })
            .then(res => {
                if (res.data.success) {
                    toast.success("Date format successfully saved");
                    this.setState({ date_format: item });
                }
            }).catch(err => {
                if (err.response.status === 401) {
                    // logout();
                } else {
                    toast.warning("Server error happens");
                }
            })
    }

    render() {
        return (
            <div className='row my-4' style={{ alignItems: 'flex-start' }}>
                <div className='col-md-3'>
                    <ul className='admin_settings'>
                        <li onClick={() => this.setState({ sidemenu: 1 })} className={`${this.state.sidemenu === 1 ? 'active' : ''}`}>Date Format</li>
                    </ul>
                </div>
                <div className='col-md-9'>
                    <div className='setting_content p-4'>
                        <div style={{ maxWidth: '500px' }} className="m-auto">
                            <h4>Select Date Format</h4>
                            {
                                formats.map((format, index) => (
                                    <div key={index} className='format-item my-1 d-flex align-items-center justify-content-between'>
                                        <div
                                            className={`custom_checkbox ${this.state.date_format === format ? 'active' : ''}`}
                                            onClick={() => this.handleChangeFormat(format)}
                                        ></div>
                                        <div className="format_text">{format}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminSettings;