import React, { useEffect, useState } from 'react'
import api from '../../api'
import { Table, Pagination, Typography, Input } from 'antd'
import ReactTimeAgo from 'react-time-ago'
import moment from 'moment'
export default function Request() {
  const [page, setPage] = React.useState(1)
  const [metadata, setMetadata] = React.useState([])

  const [search, setSearch] = useState('')
  const [querySearch, setQuerySearch] = React.useState('')

  React.useEffect(() => {
    const timeout = setTimeout(() => setSearch(prev => querySearch), 500)
    return () => clearTimeout(timeout)
  }, [querySearch])

  useEffect(() => {
    ;(async () => {
      const { data } = await api.get(`/requests/all?page=${page}&phone=${search}`)
      setMetadata(data.data)
    })()
  }, [page, search])
  const columns = [
    {
      title: 'Khách hàng',
      key: 'phone',
      render: (text, record) => <Typography.Text>{record?.userId?.phone}</Typography.Text>,
    },
    {
      title: 'CMND/CCCD',
      key: 'id',
      render: (text, record) => <Typography.Text>{record?.userId?.kyc?.id_number}</Typography.Text>,
    },
    {
      title: 'Tên',
      key: 'name',
      render: (text, record) => <Typography.Text>{record?.userId?.kyc?.name}</Typography.Text>,
    },
    {
      title: 'Số tiền rút',
      key: 'amount',
      render: (text, record) => (
        <Typography.Text>{record?.contractId?.amount?.toLocaleString()}</Typography.Text>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (text, record) => (
        <Typography.Text>
          {record.status == 'rejected'
            ? 'Thất bại'
            : record.status == 'pending'
            ? 'Chờ xác nhận'
            : 'Đã xác nhận'}
        </Typography.Text>
      ),
    },
    {
      title: 'Ghi chú',
      key: 'response',
      render: (text, record) => (
        <Typography.Text>
          {record.status == 'rejected'
            ? record.contractId.response
            : record.status == 'pending'
            ? 'Đã gửi yêu cầu chờ admin xác nhận'
            : 'Đã thành công'}
        </Typography.Text>
      ),
    },
    {
      title: 'Yêu cầu lúc',
      key: 'created_at',
      render: (text, record) => (
        <Typography.Text>{moment(record.created_at).format('HH:mm DD/MM/YYYY')}</Typography.Text>
      ),
    },
  ]
  return (
    <div>
      {' '}
      <>
        <Input.Search
          style={{ borderRadius: 5, maxWidth: 200, margin: 5 }}
          onChange={e => setQuerySearch(e.target.value)}
          placeholder="Nhập sđt khách hàng"
        />
        <Table columns={columns} dataSource={metadata} />
      </>
    </div>
  )
}
