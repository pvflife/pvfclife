import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { DatePicker, Typography, Spin, Button } from 'antd'
import api from '../../api'
import moment from 'moment'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import ExportCSV from './ExportCSV'
import { DownloadOutlined } from '@ant-design/icons'
export default () => {
  const [currentDate, setCurrentDate] = React.useState(moment(new Date()))
  const [statistics, setStatistics] = React.useState({
    new: 0,
    toZalo: 0,
  })
  const startDate = new Date(moment(currentDate).startOf('day')).getTime()
  const [state, setState] = React.useState({
    series: [
      {
        name: 'Khách hàng mới',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Đã qua zalo',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    },
  })

  React.useEffect(() => {
    ;(async () => {
      setIsCouter(true)
      const { data } = await api.get(`/statistics?date=${new Date(currentDate).getTime()}`)
      const startDate = new Date(moment(currentDate).startOf('day')).getTime()
      const ThreeAfter = startDate + 10800000
      const SixAfter = ThreeAfter + 10800000
      const NineAfter = SixAfter + 10800000
      const TweAfter = NineAfter + 10800000
      const FifteenAfter = TweAfter + 10800000
      const EighteenAfter = FifteenAfter + 10800000
      const TwentyOneAfter = EighteenAfter + 10800000
      const endDate = new Date(moment(currentDate).endOf('day')).getTime()

      let newUsers = []
      let userToZalo = []
      
      setStatistics({
        ...statistics,
        new: data.data.length,
        upload_kyc: data.data.filter(item => item.kyc).length,
        toZalo: data.data.filter(item => item.toSupportAt != 0).length,
      })

      newUsers.push(
        data.data.filter(item => item.created_at >= startDate && item.created_at <= ThreeAfter)
          .length
      )
      newUsers.push(
        data.data.filter(item => item.created_at > ThreeAfter && item.created_at <= SixAfter).length
      )
      newUsers.push(
        data.data.filter(item => item.created_at > SixAfter && item.created_at <= NineAfter).length
      )
      newUsers.push(
        data.data.filter(item => item.created_at > NineAfter && item.created_at <= TweAfter).length
      )
      newUsers.push(
        data.data.filter(item => item.created_at > TweAfter && item.created_at <= FifteenAfter)
          .length
      )
      newUsers.push(
        data.data.filter(item => item.created_at > FifteenAfter && item.created_at <= EighteenAfter)
          .length
      )
      newUsers.push(
        data.data.filter(
          item => item.created_at > EighteenAfter && item.created_at <= TwentyOneAfter
        ).length
      )
      newUsers.push(
        data.data.filter(item => item.created_at > TwentyOneAfter && item.created_at <= endDate)
          .length
      )

      userToZalo.push(
        data.data.filter(
          item =>
            item.toSupportAt != 0 && item.created_at >= startDate && item.created_at <= ThreeAfter
        ).length
      )
      userToZalo.push(
        data.data.filter(
          item =>
            item.toSupportAt != 0 && item.created_at > ThreeAfter && item.created_at <= SixAfter
        ).length
      )
      userToZalo.push(
        data.data.filter(
          item =>
            item.toSupportAt != 0 && item.created_at > SixAfter && item.created_at <= NineAfter
        ).length
      )
      userToZalo.push(
        data.data.filter(
          item =>
            item.toSupportAt != 0 && item.created_at > NineAfter && item.created_at <= TweAfter
        ).length
      )
      userToZalo.push(
        data.data.filter(
          item =>
            item.toSupportAt != 0 && item.created_at > TweAfter && item.created_at <= FifteenAfter
        ).length
      )
      userToZalo.push(
        data.data.filter(
          item =>
            item.toSupportAt != 0 &&
            item.created_at > FifteenAfter &&
            item.created_at <= EighteenAfter
        ).length
      )
      userToZalo.push(
        data.data.filter(
          item =>
            item.toSupportAt != 0 &&
            item.created_at > EighteenAfter &&
            item.created_at <= TwentyOneAfter
        ).length
      )
      userToZalo.push(
        data.data.filter(
          item =>
            item.toSupportAt != 0 && item.created_at > TwentyOneAfter && item.created_at <= endDate
        ).length
      )

      console.log(userToZalo, newUsers)
      setState({
        ...state,
        series: [
          {
            name: 'Khách hàng mới',
            data: newUsers,
          },
          {
            name: 'Đã qua zalo',
            data: userToZalo,
          },
        ],
        xaxis: {
          type: 'datetime',
          categories: [],
        },
      })
    })()
  }, [currentDate])

  const [isCouter, setIsCouter] = React.useState(false)

  const [exporting, setExporting] = React.useState(false)

  return (
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0.1 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <DatePicker onChange={e => setCurrentDate(e)} defaultValue={moment(new Date())} />
        <Button icon={<DownloadOutlined />} onClick={() => setExporting(true)}>
          Xuất file
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingTop: 10,
        }}
      >
        <div style={{ flex: 1, background: '#fff', marginRight: 10, borderRadius: 5 }}>
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="area"
            height={350}
            width={'90%'}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'space-between',
            flexDirection: 'column',
            height: 360,
          }}
        >
          <div
            style={{
              background: '#fff',
              width: 220,
              height: 180,
              display: 'flex',
              justifyContent: 'space-between',
              padding: 5,

              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: 5,
              borderRadius: 5,
            }}
          >
            <Typography.Text strong>Số khách hàng mới</Typography.Text>
            <CountUp
              end={statistics.new}
              start={0}
              duration={1}
              style={{ fontSize: 20, color: '#666', fontWeight: 'bold' }}
              onEnd={() => setIsCouter(false)}
            />
            <div></div>
          </div>
          <div
            style={{
              background: '#fff',
              width: 220,
              height: 180,
              display: 'flex',
              justifyContent: 'space-between',
              padding: 5,

              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: 5,
              borderRadius: 5,
            }}
          >
            <Typography.Text strong>Số khách hàng đã tạo hồ sơ</Typography.Text>
            <CountUp
              end={statistics.upload_kyc}
              start={0}
              duration={1}
              style={{ fontSize: 20, color: '#666', fontWeight: 'bold' }}
              onEnd={() => setIsCouter(false)}
            />
            <div></div>
          </div>
          <div
            style={{
              background: '#fff',
              width: 220,
              height: 180,
              display: 'flex',
              justifyContent: 'space-between',
              padding: 5,

              alignItems: 'center',
              flexDirection: 'column',
              marginTop: 5,
              borderRadius: 5,
            }}
          >
            <Typography.Text strong>Số khách đã qua Zalo</Typography.Text>
            <CountUp
              end={statistics.toZalo}
              start={0}
              duration={1}
              style={{ fontSize: 20, color: '#666', fontWeight: 'bold' }}
            />
            <div></div>
          </div>
          <div
            style={{
              background: '#fff',
              width: 220,
              height: 180,
              display: 'flex',
              justifyContent: 'space-between',
              padding: 5,
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: 5,
              borderRadius: 5,
            }}
          >
            <Typography.Text strong>Tỉ lệ chuyển đổi</Typography.Text>
            {!isCouter ? (
              <Typography.Text style={{ fontSize: 20, color: '#666', fontWeight: 'bold' }}>
                {Math.round((statistics.toZalo / statistics.new) * 100)} %
              </Typography.Text>
            ) : (
              <Spin spinning={isCouter} />
            )}
            <div></div>
          </div>
        </div>
      </div>
      <ExportCSV open={exporting} close={() => setExporting(false)} />
    </motion.div>
  )
}
