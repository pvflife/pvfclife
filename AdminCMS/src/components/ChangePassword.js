import { SecurityScanOutlined } from '@ant-design/icons'
import { Button, Input, message, Modal } from 'antd'
import React, { useState } from 'react'
import api from '../api'
export default function ChangePassword() {
  const [visible, setVisible] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  async function changePassword() {
    if (currentPassword != confirm) {
      message.error('Mật khẩu không trùng')
      return
    }
    if (currentPassword == '') {
      message.error('Mật khẩu không được trống')
      return
    }
    const { data } = await api.get('/users/profile')
    await api.put('/auth/password', { userId: data.data._id, password: currentPassword })
    message.success('Thay đổi thành công')
    setVisible(false)
  }
  return (
    <div>
      <Button shape="round" icon={<SecurityScanOutlined />} onClick={() => setVisible(true)}>
        Đổi mật khẩu
      </Button>
      <Modal
        title={'Thay đổi mật khẩu'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={changePassword}
        destroyOnClose
      >
        <Input
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          style={{ margin: 10, maxWidth: 200 }}
          placeholder="Nhập mật khẩu mới"
        />
        <br />
        <Input
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={{ margin: 10, maxWidth: 200 }}
        />
      </Modal>
    </div>
  )
}
