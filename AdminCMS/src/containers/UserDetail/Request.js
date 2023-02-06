import React from 'react'
import { Button, Typography, message } from 'antd'
import api from '../../api'
import useNotification from '../../hooks/useNotification'
import moment from 'moment'

const ItemText = ({ changeFunc, label, value }) => {
  return (
    <span style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
      <Typography.Text strong style={{ flex: 1, paddingRight: 10 }}>
        {label}{' '}
      </Typography.Text>
      <Typography.Text style={{ flex: 2 }}>{value}</Typography.Text>
    </span>
  )
}
export default function Request({ profile, data, dispatchReload }) {
  const [ROLE] = React.useState(localStorage.getItem('role'))
  const { pushNotifications } = useNotification()

  const request = data ? data[0] : null
  async function sumbitRequest() {
    await api.put(`/requests/${request._id}`, { status: 'accepted', amount: request.amount })
    pushNotifications({
      to: request.userId,
      message: 'Yêu cầu rút tiền được duyệt',
      description: 'Hệ thống đã xác nhận yêu cầu rút tiền của bạn. Rút tiền thành công.',
    })
    message.success('Cập nhật thành công')
    dispatchReload()
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        padding: 20,
        borderRadius: 10,
        minWidth: 420,
        margin: '0px 10px',
        maxHeight: 400,
      }}
    >
      {request ? (
        <>
          <Typography.Title level={5} style={{ textAlign: 'center', marginBottom: '0' }}>
            Lệnh rút tiền
          </Typography.Title>
          <hr />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <ItemText
              label="Ngân hàng"
              value={
                <>
                  <img style={{marginRight: '20px'}} height={'30px'} src={profile?.kyc?.bank.logo} alt='loading'/>
                  {`(${profile?.kyc?.bank.bankName})`}
                </>
              }
            />
            <ItemText
              label="Số tài khoản"
              value={profile?.kyc?.bank.number}
            />
            <ItemText
              label="Lệnh rút"
              value=''
            />
            <div style={{overflowY: 'scroll', height: '200px', marginTop: '10px'}}>
              {
                data &&
                data.map(item => {
                  return (
                    <div key={item._id}>
                      <span style={{marginRight: '20px', fontWeight: '500'}}>{moment(item.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>
                      <span style={{}}>{`Lệnh rút ${item?.amount?.toLocaleString()} vnđ`}</span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </>
      ) : (
        <Typography.Text strong style={{ textAlign: 'center' }}>
          Hiện không có yêu cầu
        </Typography.Text>
      )}
    </div>
  )
}
