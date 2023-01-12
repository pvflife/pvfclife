import React from 'react'
import './index.scss'
import { Form, Input, Button, message, Typography } from 'antd'
import api from '../../api'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions/auth'
import { useHistory } from 'react-router-dom'
export default function () {
  const history = useHistory()
  const dispatch = useDispatch()
  const [loading, setLoading] = React.useState(false)

  const onFinish = async values => {
    setLoading(true)
    try {
      const { data } = await api.post('auth/login', values)
      if (data.role == 'USER') {
        message.error('Không có quyền truy cập.')
        return
      }
      dispatch(actions.Login(data))
      history.replace('/?page=1&search=&searchId=&meta=1,2,3')
      message.success('Đăng nhập thành công.')
    } catch (err) {
      message.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center-frame" style={{ background: '#044bb0' }}>
      <Typography.Text strong style={{ fontSize: 20, color: '#fff' }}>
        Đăng nhập
      </Typography.Text>
      <div
        style={{
          border: '1px solid #999',
          padding: '50px 100px',
          borderRadius: 5,
          background: '#fff',
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tài khoản"
            name="phone"
            rules={[{ required: true, message: 'Không thể trống!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Không thể trống!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
