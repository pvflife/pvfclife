import React from 'react'
import { Layout, Menu, Switch, Typography, Space, Avatar, Popconfirm } from 'antd'
import {
  ProfileOutlined,
  TeamOutlined,
  PoweroffOutlined,
  LineChartOutlined,
  DollarCircleFilled,
} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import './index.scss'
import logo from './logo.png'
import * as actions from '../../redux/actions/auth'
import { useDispatch } from 'react-redux'
import { ChangePassword, Notifications } from '../../components'

const { Header, Sider, Content } = Layout
export default function Home({ children }) {
  const [mode, setMode] = React.useState(false)
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderMenu mode={mode} />
      <Layout>
        <HeaderCustom setMode={setMode} mode={mode} />
        <Content style={{ padding: 20 }}>{children}</Content>
      </Layout>
    </Layout>
  )
}

const HeaderCustom = ({ setMode, mode }) => {
  const dispatch = useDispatch()
  function logout() {
    dispatch(actions.Logout())
  }
  return (
    <Header className="header-bar" style={!mode ? { background: '#fff' } : {}}>
      <div>
        <ChangePassword />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 20,
          minWidth: 200,
        }}
      >
        <Notifications />
        <Switch
          onChange={() => setMode(prev => !prev)}
          unCheckedChildren={
            <Typography.Text strong style={{ fontSize: 10, color: mode ? '#fff' : '#333' }}>
              Light
            </Typography.Text>
          }
          checkedChildren={
            <Typography.Text strong style={{ fontSize: 10, color: mode ? '#fff' : '#333' }}>
              Dark
            </Typography.Text>
          }
        />
        <Popconfirm title="Xác nhận đăng xuất" onConfirm={logout}>
          <PoweroffOutlined
            style={{ fontSize: 30, color: mode ? '#7d0616' : '#bf021b', cursor: 'pointer' }}
          />
        </Popconfirm>
      </div>
    </Header>
  )
}

const SiderMenu = ({ mode }) => {
  const history = useHistory()
  const [key] = React.useState(1)
  const [ROLE] = React.useState(localStorage.getItem('role'))
  return (
    <Sider collapsible defaultCollapsed={true}>
      <Menu
        mode="inline"
        theme={mode ? 'dark' : 'light'}
        style={{
          height: '100%',
          borderRight: 0,
          paddingTop: 64,
          minHeight: '100vh',
        }}
        activeKey={key}
      >
        <Menu.Item
          key="1"
          icon={<ProfileOutlined />}
          onClick={() => {
            history.push('/')
          }}
        >
          Khách hàng
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<DollarCircleFilled />}
          onClick={() => {
            history.push('/requests')
          }}
        >
          Yêu cầu rút tiền
        </Menu.Item>
        {ROLE == 'ROOT' && (
          <>
            <Menu.Item
              key="3"
              icon={<TeamOutlined />}
              onClick={() => {
                history.push('/staffs')
              }}
            >
              Nhân viên
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<LineChartOutlined />}
              onClick={() => {
                history.push('/statistics')
              }}
            >
              Thống kê
            </Menu.Item>
          </>
        )}
      </Menu>
    </Sider>
  )
}
