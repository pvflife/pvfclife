import React, { useEffect, useState, useRef } from 'react'
import Kyc from './Kyc'
import Contracts from './Contracts'
import Request from './Request'
import History from './History'
import { useLocation } from 'react-router-dom'
import api from '../../api'
import { message, Spin } from 'antd'
export default function UserDetail() {
  const initMount = useRef(true)
  const _id = useLocation().search.split('=')[1]
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(initMount.current)
  const [refetcher, setRefetcher] = useState(false)
  useEffect(() => {
    if (initMount.current) initMount.current = false
    getDataUser()
  }, [_id, refetcher])
  async function getDataUser() {
    if (initMount.current) setLoading(true)

    try {
      const { data } = await api.get(`/users/${_id}`)
      setData(data.data)
    } catch (err) {
      message.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {loading ? (
        <Spin spinning={loading} />
      ) : (
        <>
          {data?.profile?.kyc && (
            <Kyc data={data.profile} dispatchReload={() => setRefetcher(prev => !prev)} />
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 10,
            }}
          >
            <Contracts
              data={data.contracts}
              profile={data.profile}
              dispatchReload={() => setRefetcher(prev => !prev)}
            />
            <Request profile={data.profile} data={data.request} dispatchReload={() => setRefetcher(prev => !prev)} />
            <History
              data={data.payment}
              balance={data.profile.balance}
              dispatchReload={() => setRefetcher(prev => !prev)}
            />
          </div>
        </>
      )}
    </div>
  )
}
