import { useState } from 'react'
import { Modal, Typography, DatePicker, Space, Checkbox, Select, message } from 'antd'
import moment from 'moment'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import api from '../../api'

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const fileExtension = '.xlsx'

const exportToCSV = (csvData, fileName) => {
  const ws = XLSX.utils.json_to_sheet(csvData)
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: fileType })
  FileSaver.saveAs(data, fileName + fileExtension)
}

export default function ExportCSV({ open, close }) {
  const [isExportAll, setIsExportAll] = useState(false)
  const [type, setType] = useState('yet')
  const [startDate, setStartDate] = useState(new Date().getTime())
  const [endDate, setEndDate] = useState(new Date().getTime())

  const onOK = async () => {
    try {
      const { data } = await api.post(
        `/users/export?${
          isExportAll ? `isGetAll=true` : `startDate=${startDate}&endDate=${endDate}`
        }&type=${type}`
      )
      if (type === 'yet') {
        const filteredData = data.data.map(item => ({
          sdt: item.phone,
          supporter_zalo: item?.supporter || 'Chưa qua Zalo',
        }))
        exportToCSV(filteredData, 'Danh sách khách hàng')
      } else {
        const filteredData = data.data
          .filter(item => item)
          .map(item => ({
            phone: item?.phone,
            name: item?.kyc.name,
            thu_nhap: item?.kyc.income,
            cmnd: item?.kyc.id_number,
            dia_chi: item.kyc.address,
            nghe_nghiep: item.kyc.job,
            ten_ngan_hang: item.kyc.bank_name,
            ten_chu_so_huu: item.kyc.bank_owner,
            so_tai_khoan: item.kyc.bank_number,
          }))
          console.log(filteredData)
        exportToCSV(filteredData, 'Danh sách khách hàng')
      }
    } catch (err) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
    close()
  }

  return (
    <Modal visible={open} onCancel={close} destroyOnClose onOk={onOK}>
      <Space>
        <Typography>In tất cả</Typography>
        <Checkbox
          defaultChecked={false}
          checked={isExportAll}
          onChange={() => setIsExportAll(prev => !prev)}
        />
      </Space>
      <br />
      <Space>
        <Typography>Chọn ngày :</Typography>
        <DatePicker.RangePicker
          disabled={isExportAll}
          onChange={(a, b) => {
            setStartDate(new Date(b[0]).getTime())
            setEndDate(new Date(b[1]).getTime())
          }}
        />
      </Space>
      <br />
      <br />
      <Typography>Chọn tệp khách hàng </Typography>
      <Select style={{ minWidth: 200 }} placeholder="Nhấn vào để chọn" onChange={e => setType(e)}>
        <Select.Option value={'yet'}>Chưa tạo hồ sơ</Select.Option>
        <Select.Option value={'process'}>Đã tạo hồ sơ</Select.Option>
        <Select.Option value={'done'}>Đã nhận tiền</Select.Option>
      </Select>
    </Modal>
  )
}
