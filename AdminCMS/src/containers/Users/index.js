import React, { Fragment, useState } from 'react'
import {
  Typography,
  Space,
  Checkbox,
  Input,
  Table,
  Tag,
  message,
  Popconfirm,
  Button,
  Pagination,
  Spin,
  Popover,
} from 'antd'
import api from '../../api'
import { DeleteOutlined, HighlightOutlined, LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useHistory, useLocation } from 'react-router-dom'

export default function Users() {
  const history = useHistory()
  const [ROLE] = React.useState(localStorage.getItem('role'))
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [refetch, setRefetch] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [searchId, setSearchId] = React.useState('')
  const [page, setPage] = React.useState(parseInt(useLocation().search[6]))
  const [meta, setMeta] = React.useState([1, 2, 3])
  const [metadata, setMetadata] = React.useState({})

 
  React.useEffect(() => {
    getUsers(search, searchId, meta, page)
  }, [refetch, search, searchId, meta, page])

  React.useEffect(() => {
    setPage(1)
  }, [search, searchId])

  async function updateSupporter(userId, supporter) {
    try {
      await api.put('/users/supporter', { userId, supporter })
      setRefetch(prev => !prev)
      message.success('Cập nhật thành công.')
    } catch (err) {}
  }
  async function deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`)
      setRefetch(prev => !prev)
      message.success('Xoá thành công.')
    } catch (err) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau.')
    }
  }
  async function getUsers(search, searchId, meta, page) {
    try {
      setLoading(true)
      const { data } = await api.get(
        `/users?page=${page}&search=${search}&searchId=${searchId}&meta=${meta.map(item => item)}`
      )
      setMetadata(data)
      setData(prev => [...data.docs])
    } catch (err) {
      message.error('Xảy ra lỗi, vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }
  const [customPassword, setCustomPassword] = useState('')
  const [visibleCustomPassword, setVisibleCustomPassword] = useState(null)
  async function resetPassword({ password, userId }) {
    try {
      if (password == '') {
        message.error('Không được trống')
        return
      }
      await api.put('/auth/password', { userId, password })
      message.success('Reset password thành công.')
      setVisibleCustomPassword(null)
    } catch (err) {
      message.error('Đã có lỗi xảy ra. Vui lòng thử lại sau')
    }
  }

  const columns = [
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: text => <a>{text}</a>,
    },
    {
      title: 'NV Hỗ trợ',
      dataIndex: 'supporter',
      key: 'supporter',
      render: (text, record) => (
        <>
          <Typography.Text
          >
            {record?.supporter?.name}
          </Typography.Text>
        </>
      ),
    },
    {
      title: 'Tên ',
      dataIndex: 'kyc',
      key: 'kyc',
      render: (text, record) => <>{record.kyc?.name ? record.kyc?.name : ''}</>,
    },
    {
      title: 'Trạng thái hồ sơ ',
      dataIndex: 'kyc',
      key: 'status',
      render: (text, record) => (
        <>
          {record.kyc?.status === 'accepted' && <Tag color="success">Đã duyệt hồ sơ</Tag>}
          {record.kyc?.status === 'pending' && <Tag color="processing">Đã tạo hồ sơ</Tag>}
          {record.kyc?.status === 'yet' && <Tag color="processing">Đã tạo hồ sơ</Tag>}
          {!record.kyc?.status && <Tag color="orange">Chưa xác minh</Tag>}
        </>
      ),
    },
    {
      title: 'Khởi tạo lúc ',
      dataIndex: 'created_at',
      key: 'created_at',
      render: text => (
        <Typography.Text style={{ fontSize: 12 }}>
          {moment(text).format('hh:mm A, DD-MM-YYYY')}
        </Typography.Text>
      ),
    },
    {
      title: 'Tuỳ chọn',
      key: 'action',
      render: (text, record) => (
        <Space size="large">
          <a
            onClick={() =>
              record.kyc?.status
                ? history.push(`/detail?id=${record._id}`)
                : message.info('Khách hàng chưa khởi tạo hồ sơ.')
            }
          >
            Xem chi tiết
          </a>
          {ROLE == 'ROOT' && (
            <Popconfirm
              title="Không thể khôi phục. Chắc chắn xoá ?"
              onConfirm={() => deleteUser(record._id)}
            >
              <Button icon={<DeleteOutlined />} danger shape="round">
                Xoá
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
    {
      title: 'Tuỳ chọn',
      key: 'action',
      render: (text, record) => (
        <>
          {ROLE == 'ROOT' && (
            <Popover
              visible={visibleCustomPassword == record._id}
              title="Reset password"
              content={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    aliginItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Input
                    placeholder="Nhập mật khẩu mới"
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={() => resetPassword({ password: customPassword, userId: record._id })}
                  >
                    Xác nhận
                  </Button>
                  <Button onClick={() => setVisibleCustomPassword(null)}>Hủy</Button>
                </div>
              }
            >
              <Button
                type="link"
                shape="round"
                onClick={() => setVisibleCustomPassword(record._id)}
              >
                Reset password
              </Button>
            </Popover>
          )}
        </>
      ),
    },
  ]

  return (
    <Fragment>
      <Optional setSearch={setSearch} setSearchId={setSearchId} setMeta={setMeta} meta={meta} />

      {loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} />} />
      ) : (
        <>
          <Table columns={columns} dataSource={data} pagination={false} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
            <Pagination
              total={metadata.totalDocs}
              current={page}
              onChange={e => setPage(e)}
              pageSize={10}
              pageSizeOptions={['10']}
            />
          </div>
        </>
      )}
    </Fragment>
  )
}

const Optional = ({ setSearch, setMeta, setSearchId, meta }) => {
  const [querySearch, setQuerySearch] = React.useState('')
  const [querySearchId, setQuerySearchId] = React.useState('')

  React.useEffect(() => {
    const timeout = setTimeout(() => setSearch(prev => querySearch), 500)
    return () => clearTimeout(timeout)
  }, [querySearch])

  React.useEffect(() => {
    const timeout = setTimeout(() => setSearchId(prev => querySearchId), 500)
    return () => clearTimeout(timeout)
  }, [querySearchId])

  return (
    <Fragment>
      <div>
        <Typography.Title level={5}>Tuỳ chọn</Typography.Title>
      </div>
      <Space>
        <div style={{ paddingRight: 15 }}>
          <Typography.Text style={{ padding: 5, fontSize: 15 }}>Chưa xác minh</Typography.Text>
          <Checkbox
            defaultChecked
            onChange={() =>
              setMeta(prev => (prev.includes(1) ? prev.filter(item => item != 1) : [...prev, 1]))
            }
          />
        </div>
        <div style={{ paddingRight: 15 }}>
          <Typography.Text style={{ padding: 5, fontSize: 15 }}>Đã xác minh</Typography.Text>
          <Checkbox
            defaultChecked
            onChange={() =>
              setMeta(prev => (prev.includes(2) ? prev.filter(item => item != 2) : [...prev, 2]))
            }
          />
        </div>
        <div style={{ paddingRight: 15 }}>
          <Typography.Text style={{ padding: 5, fontSize: 15 }}>Đã tạo hồ sơ</Typography.Text>
          <Checkbox
            defaultChecked
            onChange={() =>
              setMeta(prev => (prev.includes(3) ? prev.filter(item => item != 3) : [...prev, 3]))
            }
          />
        </div>
      </Space>
      <div style={{ padding: '20px 0px ' }}>
        <Space>
          <Input.Search
            placeholder="SĐT hoặc CMNN/CCCD"
            onChange={e => setQuerySearch(e.target.value)}
          />
          {/* <Input.Search
            placeholder="CMNN / CCCD"
            onChange={e => setQuerySearchId(e.target.value)}
          /> */}
        </Space>
      </div>
    </Fragment>
  )
}
