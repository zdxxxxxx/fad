import React, { Component } from 'react'
import { Input } from 'antd'
import Nav from '../components/Nav.jsx'
class Index extends Component {
    render() {
        return (
            <div>
                <Nav />
                <div style={{ marginTop: 30 }}>welcome! fard</div>
                <Input />
            </div>
        )
    }
}
export default Index