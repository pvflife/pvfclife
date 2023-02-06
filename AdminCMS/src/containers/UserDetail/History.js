import React from 'react'
import { Typography, Modal, Button, Form, Input, message } from 'antd'
import api from '../../api'
import { useLocation } from 'react-router-dom'
import useNotification from '../../hooks/useNotification'
import CurrencyInput from 'react-currency-input-field'
import moment from 'moment'

const ItemText = ({ changeFunc, label, value }) => {
  return (
    <span style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
      <Typography.Text style={{ flex: 1, paddingRight: 10 }}>{label} </Typography.Text>
      <Typography.Text strong style={{ flex: 2 }}>
        {value}
      </Typography.Text>
    </span>
  )
}

export default function History({ data, balance, dispatchReload }) {
  const [ROLE] = React.useState(localStorage.getItem('role'))
  const { pushNotifications } = useNotification()
  const [visible, setVisible] = React.useState(false)
  const [status, setStatus] = React.useState(false)
  const id = useLocation().search.split('=')[1]
  const [amount, setAmount] = React.useState(0)
  const [description, setDescription] = React.useState('')
  async function updateBalance() {
    await api.post(`/users/${id}`, { status, amount, description })
    setVisible(false)
    message.success('Cập nhật thành công')
    pushNotifications({
      to: id,
      message: `Hệ thống ${status ? 'cộng' : 'trừ'} ví tiền`,
      description: `Bạn đã ${status ? 'được cộng' : 'bị trừ'} ${parseInt(
        amount
      ).toLocaleString()} VND. ${description ? `Lí do : ${description}` : ''} `,
    })
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
        flex: 1,
      }}
    >
      <Typography.Text strong style={{ textAlign: 'center' }}>
        Ví người dùng
      </Typography.Text>
      <hr />
      <ItemText label="Số dư" value={`${balance?.toLocaleString()} VND`} />
      {ROLE == 'ROOT' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingTop: 10,
          }}
        >
          <Button
            type="dashed"
            onClick={() => {
              setVisible(true)
              setStatus(false)
            }}
          >
            Trừ ví
          </Button>
          <Button
            type="dashed"
            onClick={() => {
              setVisible(true)
              setStatus(true)
            }}
          >
            Cộng ví
          </Button>
        </div>
      )}
      <Typography.Text strong>Lịch sử</Typography.Text>
      <div>
        {data.map(item => (
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            key={item._id}
          >
            <Typography.Text>
              {item.description ? moment(item.created_at).format('DD/MM/YYYY HH:mm:ss') + ': ' + item.description : 'Không ghi chú'}
            </Typography.Text>
            <Typography.Text>{`${
              item.status ? '+' : '-'
            }${item?.amount?.toLocaleString()}`}</Typography.Text>
          </div>
        ))}
      </div>
      <Modal
        visible={visible}
        onOk={() => setVisible(false)}
        okText="Đóng"
        cancelButtonProps={{
          style: {
            display: 'none',
          },
        }}
        closable
        destroyOnClose
        onCancel={() => setVisible(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 30 }}>
          <Typography.Text strong style={{ textAlign: 'center' }}>
            {!status ? `Trừ tiền từ ví khách` : 'Cộng tiền vào ví khách'}
          </Typography.Text>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <CurrencyInput
            style={{
              fontSize: 18,
              width: '100%',
              padding: 5,
              margin: 10,
              border: '1px #eee solid',
            }}
            min={0}
            placeholder="Nhập số tiền vay"
            decimalsLimit={2}
            onValueChange={(value, name) => setAmount(parseInt(value))}
          />

          <Input
            placeholder="Nhập lí do"
            onChange={e => setDescription(e.target.value)}
            style={{
              fontSize: 18,
              width: '100%',
              padding: 5,
              margin: 10,
              border: '1px #eee solid',
            }}
          />
          <Button type="primary" onClick={updateBalance}>
            Cập nhật
          </Button>
        </div>
      </Modal>
    </div>
  )
}
