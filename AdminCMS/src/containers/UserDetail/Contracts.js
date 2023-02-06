import React, { useState } from 'react'
import { Typography, Switch, Select, Button, Modal, message, Input } from 'antd'
import { HighlightOutlined } from '@ant-design/icons'
import Template from './Template'
import api from '../../api'
import useNotifications from '../../hooks/useNotification'
export default function Contracts({ data, profile, dispatchReload }) {
  const { pushNotifications } = useNotifications()
  const [ROLE] = React.useState(localStorage.getItem('role'))
  const [visible, setVisible] = useState(false)
  const [currentReason, setCurrentReason] = useState(data[0]?.response || {})
  const [canWithdraw, setCanWithdraw] = useState(String(data[0]?.response) === 'accepted')
  const [loading, setLoading] = useState(false)

  async function confirmContract() {
    setLoading(true)
    await api.put(`/contracts/${data[0]._id}/confirm`, {
      status: 'accepted',
    })
    pushNotifications({
      to: profile._id,
      message: 'Hợp đồng vay đã được duyệt',
      description: `Khoản vay ${data?.[0].amount?.toLocaleString()} VND, ${
        data?.[0]?.times
      } tháng đã được thông qua. Hãy yêu cầu rút tiền.`,
    })
    message.success('Cập nhật thành công.')
    setLoading(false)
    dispatchReload()
  }

  async function updateContract() {
    await api.put(`/contracts/${data[0]._id}`, {
      response: canWithdraw ? 'accepted' : currentReason,
    })

    message.success('Cập nhật thành công.')
    setEditReason(false)
    dispatchReload()
  }

  async function updateItem(field, value) {
    let obj = {}
    obj[field] = value
    await api.put(`/contracts/${data[0]._id}`, { ...obj })
    message.success('Cập nhật thành công.')
    dispatchReload()
    setEditMonth(false)
  }
  const [editMonth, setEditMonth] = useState(false)
  const [editReason, setEditReason] = useState(false)

  const [currentTimes, setCurrentTimes] = useState(data[0]?.times)

  return (
    <>
      {data[0] && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            background: '#fff',
            padding: 20,
            borderRadius: 10,
            minWidth: 420,
            flex: 2,
            maxHeight: 400,
          }}
        >
          <ItemText
            label="Số tiền "
            value={data?.[0]?.amount?.toLocaleString()}
            editable
            changeFunc={e => updateItem('amount', parseInt(e.split(',').join('')))}
          />
          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 5,
            }}
          >
            <Typography.Text strong style={{ flex: 1, paddingRight: 10, fontSize: 16 }}>
              Trạng thái
            </Typography.Text>
            {data[0].status === 'pending' ? (
              <div style={{ flex: 2 }}>
                <Button type="primary" size={'small'} onClick={confirmContract} loading={loading}>
                  Duyệt
                </Button>
              </div>
            ) : (
              'Đã duyệt'
            )}
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 5,
            }}
          >
            <Typography.Text strong style={{ flex: 1, paddingRight: 10, fontSize: 16 }}>
              Thời hạn :
            </Typography.Text>
            {editMonth ? (
              <div style={{ flex: 2 }}>
                <Select
                  style={{ minWidth: 100 }}
                  value={currentTimes}
                  onChange={e => setCurrentTimes(e)}
                >
                  <Select.Option value={6}>6 tháng</Select.Option>
                  <Select.Option value={12}>12 tháng</Select.Option>
                  <Select.Option value={24}>24 tháng</Select.Option>
                  <Select.Option value={36}>36 tháng</Select.Option>
                </Select>
                <Button type="primary" onClick={() => updateItem('times', currentTimes)}>
                  Xác nhận
                </Button>
                <Button onClick={() => setEditMonth(false)}>Huỷ</Button>
              </div>
            ) : (
              <Typography.Text
                style={{
                  fontSize: 16,
                  flex: 2,
                }}
              >
                {`${data[0].times} tháng `}
                <HighlightOutlined
                  style={{ color: '#4996f7' }}
                  onClick={() => setEditMonth(true)}
                />
              </Typography.Text>
            )}
          </span>
          <ItemText label="Mã hợp đồng" value={data[0].slug} />
          {ROLE !== 'USER' && data[0].status === 'accepted' && (
            <>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 5,
                }}
              >
                <Typography.Text strong style={{ flex: 1, paddingRight: 10, fontSize: 16 }}>
                  Rút tiền :
                </Typography.Text>
                <span style={{ flex: 2 }}>
                  <Switch
                    defaultChecked={String(data[0]?.response) === 'accepted'}
                    onChange={() => setCanWithdraw(prev => !prev)}
                  />
                </span>
              </span>

              {!canWithdraw && (
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 5,
                  }}
                >
                  <Typography.Text strong style={{ flex: 1, paddingRight: 10, fontSize: 16 }}>
                    Lí do từ chối :
                  </Typography.Text>
                  <span
                    style={{
                      flex: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {editReason ? (
                      <>
                        <Input
                          onChange={e => setCurrentReason(e.target.value)}
                          value={currentReason}
                        />
                      </>
                    ) : (
                      <Select
                        style={{ minWidth: 200 }}
                        placeholder={currentReason}
                        value={currentReason}
                        onChange={e => setCurrentReason(e)}
                      >
                        <Select.Option value="Sai thông tin liên kết ví">
                          Sai thông tin liên kết ví
                        </Select.Option>
                        <Select.Option value="Rút tiền sai phạm hợp đồng vay">
                          Rút tiền sai phạm hợp đồng vay
                        </Select.Option>
                        <Select.Option value="Đóng băng cờ bạc">Đóng băng cờ bạc</Select.Option>
                        <Select.Option value="Điểm tín dụng chưa đủ">
                          {' '}
                          Điểm tín dụng chưa đủ
                        </Select.Option>
                        <Select.Option value="Hồ sơ bất cập">Hồ sơ bất cập</Select.Option>
                        <Select.Option value="Đóng băng khoản vay">
                          Đóng băng khoản vay
                        </Select.Option>
                        <Select.Option value="Cấp mã OTP thất bại !">
                          Cấp mã OTP thất bại !
                        </Select.Option>
                        {/* <Select.Option value="Lệnh rút tiền đã được tạo. Vui lòng nhận khoản vay sau 10 phút.">
                          Lệnh rút tiền đã được tạo. Vui lòng nhận khoản vay sau 10 phút.
                        </Select.Option> */}
                      </Select>
                    )}
                  </span>
                  <Button onClick={() => setEditReason(prev => !prev)}>
                    {editReason ? 'Huỷ' : 'Khác'}
                  </Button>
                </span>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 10,
                }}
              >
                <Button type="primary" onClick={() => setVisible(true)}>
                  Xem hợp đồng
                </Button>
                {String(data[0].status) === 'accepted' && (
                  <Button type="primary" onClick={updateContract}>
                    Cập nhật
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      )}
      <Modal
        visible={visible}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
        style={{ minWidth: '80vw' }}
      >
        <Template contract={data[0]} user={profile} />
      </Modal>
    </>
  )
}
const ItemText = ({ changeFunc, label, value, editable = false }) => {
  const [ROLE] = React.useState(localStorage.getItem('role'))

  return (
    <span
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}
    >
      <Typography.Text strong style={{ flex: 1, paddingRight: 10, fontSize: 16 }}>
        {label} :
      </Typography.Text>
      <Typography.Text
        style={{
          fontSize: 16,
          flex: 2,
        }}
        editable={
          editable && ROLE === 'ROOT'
            ? {
                icon: <HighlightOutlined />,
                tooltip: 'Click để chỉnh sửa',
                onChange: e => changeFunc(e),
              }
            : false
        }
      >
        {value}
      </Typography.Text>
    </span>
  )
}
