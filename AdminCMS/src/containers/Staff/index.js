import React, { useEffect, useState } from 'react'
import api from '../../api'
import { Table, Typography, Space, Modal, Button, Select, Input, message, Popconfirm,Pagination } from 'antd'
import moment from 'moment'
import { HighlightOutlined } from '@ant-design/icons'
import IconZalo from '../../assets/zalo-logo.png'
import IconFacebook from '../../assets/facebook-icon.png'
import isCorrectNumberPhone from '../../utils/isCorrectNumberPhone';
export default () => {
  const [onReload, setOnReload] = useState(false)
  const [supporters, setSupporters] = useState([])
  const [refetcher, setRefetcher] = useState(false)
  const [page, setPage] = React.useState(1)
  const [totalDocs, setTotalDocs] = useState(1)
  useEffect(() => {
    ;(async () => {
      const { data } = await api.get(`/company?page=${page}&limit=10`)
      setSupporters(data.data)
      setTotalDocs(data.totalDocs)
    })()
  }, [refetcher,page])

  const [openDetail, setOpenDetail] = useState(false)
  const [currentData, setCurrentData] = useState([])

  const columns = [
    // {
    //   title: 'Hash key',
    //   dataIndex: '_id',
    //   key: '_id',
    // },
    {
      title: 'SĐT Zalo/ID Facebook',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Loại tài khoản',
      dataIndex: '',
      key: '',
      render: (text, record) => (
        <Typography.Text>
          { isCorrectNumberPhone(record.phone) ? 
            <img src={IconZalo} alt="loading..." className='type-icon'/> :
            <img src={IconFacebook} alt="loading..." className='type-icon'/>
          }
        </Typography.Text>
      ),
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Typography.Text
          editable={{
            icon: <HighlightOutlined />,
            tooltip: 'Click để chỉnh sửa',
            onChange: e => updateItem(record._id, record, 'name', e),
          }}
        >
          {record.name}
        </Typography.Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (text, record) => (
        <Typography.Text>{record.is_active ? 'Đang kích hoạt' : 'Đã khoá'}</Typography.Text>
      ),
    },
    {
      title: 'Số khách hàng đã liên hệ qua SĐT Zalo/Facebook trong ngày',
      dataIndex: 'today',
      key: 'today',
      render: (text, record) => (
        <Space>
          <Typography.Text>{record.today.length} khách</Typography.Text>
          <Typography.Link
            onClick={() => {
              setCurrentData(record.today)
              setOpenDetail(true)
            }}
          >
            Xem chi tiết
          </Typography.Link>
        </Space>
      ),
    },
    {
      title: 'Giới hạn trong ngày',
      dataIndex: 'limit',
      key: 'limit',
      render: (text, record) => (
        <Typography.Text
          type="number"
          editable={{
            icon: <HighlightOutlined />,
            tooltip: 'Click để chỉnh sửa',
            onChange: e => updateItem(record._id, record, 'limit', parseInt(e)),
          }}
        >
          {record.limit}
        </Typography.Text>
      ),
    },
    {
      title: 'Tuỳ chọn',
      key: 'optional',
      render: (text, record) => (
        <Space>
          <Button onClick={() => toggle(record._id)} style={{ minWidth: 100 }}>
            {record.is_active ? 'Khoá' : 'Mở khoá'}
          </Button>
          <Popconfirm title="Xoá ? Không thể khôi phục" onConfirm={() => deleteItem(record._id)}>
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const [openTransfer, setOpenTransfer] = useState(false)
  const [oldSupporter, setOldSupporter] = useState(null)
  const [newSupporter, setNewSupporter] = useState('')
  const [addSupporter, setAddSupporter] = useState(false)
  const [text, setText] = useState('')
  async function ConfirmTransfer() {
    try {
      await api.post('/users/transfer', { oldSupporter, newSupporter })
      message.success('Cập nhật thành công')
      setRefetcher(prev => !prev)
      setOpenTransfer(false)
    } catch (err) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }

  async function create() {
    try {
      await api.post('/company', {
        phone: text,
        name: '',
      })
      setText('')
      message.success('Thêm thành công.')
      setRefetcher(prev => !prev)
      setAddSupporter(false)
    } catch (err) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }

  async function deleteItem(id) {
    try {
      await api.delete(`/company/${id}`)
      message.success('Xoá thành công.')
      setRefetcher(prev => !prev)
    } catch (err) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }

  async function toggle(id) {
    try {
      await api.post(`/company/${id}`)
      message.success('Thay đổi trạng thái thành công.')
      setRefetcher(prev => !prev)
    } catch (err) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }
  async function updateItem(id, record, field, value) {
    try {
      let obj = {}
      obj[field] = value
      await api.put(`/company/${id}`, {
        phone: record.phone,
        name: record.name,
        limit: record.limit,
        is_active: record.is_active,
        ...obj,
      })
      message.success('Thay đổi  thành công.')
      setRefetcher(prev => !prev)
    } catch (err) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={() => setOpenTransfer(true)}>Chỉnh sửa SĐT Zalo/Facebook hỗ trợ</Button>
        {!addSupporter ? (
          <Button onClick={() => setAddSupporter(true)} type="primary">
            Thêm
          </Button>
        ) : (
          <>
            <Space>
              <Input
                style={{ width: '300px' }}
                placeholder="Nhập vào SĐT Zalo hoặc ID Facbook CSKH"
                type="primary"
                onChange={e => setText(e.target.value)}
              />
              <Button type="primary" onClick={create}>
                Cập nhật
              </Button>
              <Button onClick={() => setAddSupporter(false)}>Huỷ</Button>
            </Space>
          </>
        )}
      </div>
      <br />
      
      <Table dataSource={supporters} columns={columns} pagination={false} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
          <Pagination
            total={totalDocs}
            current={page}
            onChange={e => setPage(e)}
            pageSize={10}
            pageSizeOptions={['10']}
          />
        </div>
      <ModalDetail open={openDetail} data={currentData} onClose={() => setOpenDetail(false)} />
      <Modal
        visible={openTransfer}
        onOk={ConfirmTransfer}
        onCancel={() => {
          setOpenTransfer(false)
          setOldSupporter(null)
          setNewSupporter('')
        }}
        destroyOnClose
      >
        <Space>
          <Typography.Text>Chọn SĐT Zalo cũ</Typography.Text>
          <Select
            placeholder={'Chọn SĐT Zalo/Facebook cũ cần chuyển'}
            style={{ minWidth: 200 }}
            onChange={e => setOldSupporter(e)}
          >
            {supporters.map(item => (
              <Select.Option value={item.phone} key={item._id}>
                {item.phone}
              </Select.Option>
            ))}
          </Select>
        </Space>
        <br />
        <br />
        <br />
        <br />
        <Space>
          <Typography.Text> Nhập SĐT Zalo mới </Typography.Text>
          <Input
            placeholder="Nhập vào SĐT Zalo hoặc Facebook mới"
            value={newSupporter}
            onChange={e => setNewSupporter(e.target.value)}
            style={{ width: '280px' }}
          />
        </Space>
      </Modal>
    </>
  )
}

export const ModalDetail = ({ open, onClose, data }) => {
  const columns = [
    {
      title: 'Số điện thoại khách hàng',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Thời gian nhận khách',
      dataIndex: 'time',
      key: 'time',
      render: (text, record) => (
        <Typography.Text>
          {moment(text || record.toSupportAt).format('hh:mm A, DD-MM-YYYY')}
        </Typography.Text>
      ),
    },
  ]
  return (
    <Modal visible={open} onOk={onClose} onCancel={onClose}>
      <Table columns={columns} dataSource={data} />
    </Modal>
  )
}
