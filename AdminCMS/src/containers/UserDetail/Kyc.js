import React from 'react'
import { Avatar, Typography, Button, Spin, message, Tag, Image } from 'antd'
import { HighlightOutlined } from '@ant-design/icons'
import api from '../../api'

const ItemText = ({ changeFunc, label, value, editable }) => {
  const [ROLE] = React.useState(localStorage.getItem('role'))

  return (
    <span style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
      <Typography.Text style={{ flex: 1, paddingRight: 10 }}>{label} </Typography.Text>
      <Typography.Text
        style={{ flex: 2 }}
        editable={
          editable && ROLE !== 'USER'
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
export default function Kyc({ data, dispatchReload }) {
  const [ROLE] = React.useState(localStorage.getItem('role'))

  async function updateItem(field, value) {
    let obj = {}
    obj[field] = value
    await api.put(`/users/${data._id}`, { ...data.kyc, ...obj })
    message.success('Cập nhật thành công')
    dispatchReload()
  }

  async function updateBank(field, value) {
    let obj = {}
    obj = { ...data.kyc.bank }
    obj[field] = value
    await api.put(`/users/${data._id}`, { ...data.kyc, bank: obj })
    message.success('Cập nhật thành công')
    dispatchReload()
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          background: '#fff',
          padding: 20,
          borderRadius: 10,
          flex: 2,
          marginRight: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 20,
            flex: 1,
          }}
        >
          {data.kyc.status === 'accepted' && (
            <Tag color="success" style={{ margin: 10 }}>
              Đã xác minh
            </Tag>
          )}
          <Avatar size={120} src={data.avatar} />
          <Phone userId={data?._id} phone={data?.phone} editable reload={dispatchReload} />
          <Typography.Text
            strong
            editable={
              ROLE !== 'USER'
                ? {
                    icon: <HighlightOutlined />,
                    tooltip: 'Click để chỉnh sửa',
                    onChange: e => updateItem('name', e),
                  }
                : false
            }
          >
            {data?.kyc?.name}
          </Typography.Text>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 2,
          }}
        >
          <ItemText
            label="Số CMND"
            value={data.kyc?.id_number}
            changeFunc={e => updateItem('id_number', e)}
            editable
          />
          <ItemText
            label="Ngày sinh"
            value={data.kyc?.dob}
            changeFunc={e => updateItem('dob', e)}
            editable
          />
          <ItemText
            label="Địa chỉ"
            value={data.kyc?.address}
            changeFunc={e => updateItem('address', e)}
            editable
          />
          <ItemText
            label="Nghề nghiệp"
            value={data.kyc?.job}
            changeFunc={e => updateItem('job', e)}
            editable
          />
        
          <ItemText
            label="Giới tính"
            value={data.kyc?.sex}
            changeFunc={e => updateItem('sex', e)}
            editable
          />
          <ItemText
            label="Thu nhập"
            value={data.kyc?.income}
            changeFunc={e => updateItem('income', e)}
            editable
          />
          <ItemText label="Mục đích vay" value={data?.kyc?.purpose} />
          <ItemText
            label="SĐT người thân"
            value={data.kyc?.relative_number}
            changeFunc={e => updateItem('relative_number', e)}
            editable
          />
          <ItemText
            label="Mối quan hệ với người thân"
            value={data.kyc?.relative}
            changeFunc={e => updateItem('relative', e)}
            editable
          />

          {data.kyc.status !== 'accepted' && ROLE !== 'USER' && (
            <Button
              type="primary"
              style={{ marginTop: 30 }}
              onClick={() => updateItem('status', 'accepted')}
            >
              Xác minh khách hàng
            </Button>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography.Title level={5}>Thông tin tài khoản thụ hưởng</Typography.Title>
          <ItemText
            label="Ngân hàng"
            value={data?.kyc?.bank?.bankName}
            changeFunc={e => updateBank('bankName', e)}
            editable
          />
          <ItemText
            label="Tên người thụ hưởng"
            value={data?.kyc?.bank?.name}
            changeFunc={e => updateBank('name', e)}
            editable
          />
          <ItemText
            label="Số tài khoản"
            value={data?.kyc?.bank?.number}
            changeFunc={e => updateBank('number', e)}
            editable
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          background: '#fff',
          padding: 20,
          borderRadius: 10,
          flex: 1,
        }}
      >
        <Carousel images={[data.kyc.id_front, data.kyc.id_back, data.kyc.id_with_face]} />
      </div>
    </div>
  )
}

const Phone = ({ userId, phone, editable, reload }) => {
  const [ROLE] = React.useState(localStorage.getItem('role'))

  async function changeFunc(e) {
    await api.put(`/users/${userId}/login-phone`, { userId, newPhone: e })
    message.success('Thành công.')
    reload()
  }
  return (
    <span style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
      <Typography.Text
        strong
        style={{ flex: 2 }}
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
        {phone}
      </Typography.Text>
    </span>
  )
}
const Carousel = ({ images }) => {
  const [key, setKey] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(prev => !prev), 250)
    return () => clearTimeout(timeout)
  }, [key])
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minWidth: 350,
      }}
    >
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 350,
          }}
        >
          <Spin spinning={loading} />
        </div>
      ) : (
        <Image src={images[key]} height={350} width={'auto'} />
      )}
      <Typography.Text strong style={{ textAlign: 'center' }}>
        {key === 0 && 'Ảnh trước CMND'}
        {key === 1 && 'Ảnh sau CMND'}
        {key === 2 && 'Ảnh chân dùng'}
      </Typography.Text>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 10,
          minWidth: '100%',
        }}
      >
        <Button disabled={key === 0} onClick={() => setKey(prev => prev - 1)}>
          Trước
        </Button>
        <Button disabled={key === 2} onClick={() => setKey(prev => prev + 1)}>
          Sau
        </Button>
      </div>
    </div>
  )
}
