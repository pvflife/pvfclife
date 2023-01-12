import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import 'antd/dist/antd.min.css'

import TimeAgo from 'javascript-time-ago'

import vi from 'javascript-time-ago/locale/vi.json'

TimeAgo.addDefaultLocale(vi)

ReactDOM.render(<App />, document.getElementById('root'))
