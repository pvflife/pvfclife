import Api from '../api'
import { useEffect, useState } from 'react'
import useNotifications from '../hooks/useNotification'
import { BellOutlined } from '@ant-design/icons'
import { Badge, Popover, Typography } from 'antd'
import moment from 'moment'
export default function Notifications() {
  const { notifications, setNotifications } = useNotifications()
  const [page, setPage] = useState(1)
  const [canNext, setCanNext] = useState(false)
  useEffect(() => {
    ;(async () => {
      const { data } = await Api.get(`/notifications?page=${page}`)
      setNotifications(prev => [...prev, ...data.data.docs])
      setCanNext(data.hasNextPage)
    })()
  }, [page])

  const content = (
    <div style={{ maxHeight: 600, overflowY: 'scroll', minWidth: '100%' }}>
      {notifications.map(item => (
        <ItemNotification key={item._id} item={item} setNotifications={setNotifications} />
      ))}
      {canNext && (
        <Typography.Link onClick={() => setPage(prev => prev + 1)}>Cũ hơn</Typography.Link>
      )}
    </div>
  )
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <Popover content={content} title="Trung tâm thông báo" trigger="click" destroyTooltipOnHide>
        <Badge count={notifications.filter(item => !item.status).length}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </Popover>
    </div>
  )
}

const ItemNotification = ({ item, setNotifications }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!item.status)
        (async () => {
          await Api.post(`notifications/${item._id}`)
          setNotifications(prev => [
            ...prev.map(i => {
              if (i._id == item._id) {
                i['status'] = true
              }
              return i
            }),
          ])
        })()
    }, 700)
    return () => clearTimeout(timeout)
  }, [item])
  return (
    <div
      style={{ padding: 5, paddingRight: 10 }}
      className={`notification-item ${!item.status ? 'notification-unseen' : ''}`}
    >
      <Typography.Text strong>{item.message}</Typography.Text>
      <br />
      <Typography.Text>{item.description}</Typography.Text>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography.Text style={{ fontSize: 13 }}>
          {moment(item.createdAt).format('hh:mm A, DD-MM-YYYY')}
        </Typography.Text>
      </div>
    </div>
  )
}
