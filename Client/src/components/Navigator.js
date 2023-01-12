import { useState } from 'react';
import {
  HomeOutlined,
  UserOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { Typography } from 'antd';
import connectCSKH from '../utils/connectCSKH';

export default function Navigator() {
  const history = useHistory();
  const [current, setCurrent] = useState('home');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 60,
        padding: '0px 30px',
        borderTop: '1px solid #eee',
        paddingBottom: 10,
        background: '#fff',
      }}
    >
      <motion.div
        whileHover={{ scale: 0.9 }}
        whileTap={{ scale: 0.9 }}
        style={{
          minHeight: 45,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          background: '#fff',
        }}
        onClick={() => {
          history.push('/');
          setCurrent('home');
        }}
      >
        <HomeOutlined
          style={{
            fontSize: 20,
            color: current == 'home' ? '#006ead' : '#666',
          }}
        />
        <Typography.Text
          style={{
            fontSize: 12,
            color: current == 'home' ? '#006ead' : '#666',
          }}
        >
          Trang chủ
        </Typography.Text>
      </motion.div>

      <motion.div
        whileHover={{ scale: 0.9 }}
        whileTap={{ scale: 0.9 }}
        style={{
          minHeight: 45,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          background: '#fff',
        }}
        onClick={connectCSKH}
      >
        <CustomerServiceOutlined
          style={{
            fontSize: 20,
            color: current == 'support' ? '#006ead' : '#666',
          }}
        />
        <Typography.Text
          style={{
            fontSize: 12,
            color: current == 'support' ? '#006ead' : '#666',
          }}
        >
          Hỗ trợ
        </Typography.Text>
      </motion.div>

      <motion.div
        whileHover={{ scale: 0.9 }}
        whileTap={{ scale: 0.9 }}
        style={{
          minHeight: 60,
          borderRadius: 25,
          minWidth: 60,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
        onClick={() => {
          setCurrent('wallet');
          history.push('/wallet');
        }}
      >
        <CreditCardOutlined
          style={{
            fontSize: 20,
            color: current == 'wallet' ? '#006ead' : '#666',
          }}
        />
        <Typography.Text
          style={{
            fontSize: 12,
            color: current == 'wallet' ? '#006ead' : '#666',
          }}
        >
          Ví tiền
        </Typography.Text>
      </motion.div>

      <motion.div
        whileHover={{ scale: 0.9 }}
        whileTap={{ scale: 0.9 }}
        style={{
          minHeight: 45,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          background: '#fff',
        }}
        onClick={() => {
          history.push('/me');
          setCurrent('me');
        }}
      >
        <UserOutlined
          style={{
            fontSize: 20,
            color: current == 'me' ? '#006ead' : '#666',
          }}
        />
        <Typography.Text
          style={{
            fontSize: 12,
            color: current == 'me' ? '#006ead' : '#666',
          }}
        >
          Hồ sơ
        </Typography.Text>
      </motion.div>
    </div>
  );
}
