import React, { useState, useEffect } from 'react';
import { Badge, Typography, Carousel, Image, Button } from 'antd';
import { AlertFilled, DashboardFilled, SlidersFilled } from '@ant-design/icons';
import tickAsset from '../../assets/tick.png';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../components';
import home from '../../assets/banner.jpg';
import './Home.scss';
import { useDispatch, useSelector } from 'react-redux';
const arrayText = [
  'Chúc mừng 097***4 đã rút 35.000.000 đ',
  'Chúc mừng 033***8 đã rút 30.000.000 đ',
  'Chúc mừng 087***3 đã rút 45.000.000 đ',
  'Chúc mừng 033***1 đã rút 100.000.000 đ',
  'Chúc mừng 035***5 đã được duyệt hồ sơ',
  'Chúc mừng 033***5 đã rút 80.000.000 đ',
];

export default function Home() {
  const history = useHistory();
  const { profile } = useSelector((state) => state._auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < arrayText.length - 1)
        setCurrentIndex((prev) => prev + 1);
      else setCurrentIndex((prev) => 0);
    }, 2500);
    return () => clearInterval(interval);
  });
  return (
    <motion.div
      initial={{ opacity: 0.3, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
    >
      <div className="header-content">
        <div>
          <Typography.Text className="text-head">Xin chào </Typography.Text>
          <Typography.Text className="text-head">
            {profile?.kyc?.name || profile.phone}
          </Typography.Text>
        </div>
        <motion.div
          whileTap={{ scale: 0.9, opacity: 0.7 }}
          onClick={() => history.push('/notifications')}
        >
          <Notification />
        </motion.div>
      </div>

      <div className='flex justify-center'>
        <img src={require('../../assets/logo.png')} width={100} alt="banner" />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: 150,
          marginTop: 20,
        }}
      >
        <Image
          preview={false}
          src={home}
          width={'90%'}
          style={{ borderRadius: 10 }}
        />
      </div>

      <div className="noti-text-container">
        <Typography.Text className="noti-text">
          <p>{arrayText[currentIndex]}</p>
          <p>{arrayText[currentIndex - 1]}</p>
        </Typography.Text>
      </div>

      <div className="flex w-full mt-4  justify-evenly items-center text-center">
        <div>
          <div className="bg-[#006ead] p-4 rounded-xl ">
            <img src="https://i.imgur.com/K4FwYjY.png" width={75} />
          </div>
          <span className="text-md font-semibold">Tiết kiệm lớn</span>
        </div>
        <div>
          <div className="bg-[#006ead] p-4 rounded-xl">
            <img src="https://i.imgur.com/OSZE3zH.png" width={75} />
          </div>
          <span className="text-md font-semibold">Lãi xuất thấp</span>
        </div>
        <div>
          <div className="bg-[#006ead] p-4 rounded-xl">
            <img src="https://i.imgur.com/9IOHAZt.png" width={75} />
          </div>
          <span className="text-md font-semibold">Giải ngân nhanh</span>
        </div>
      </div>

      <Button
        className="choose-btn"
        onClick={() => {
          history.push('/vay');
        }}
      >
        <Typography.Text
          style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}
        >
          Đăng ký khoản vay
        </Typography.Text>
      </Button>

      <Carousel autoplay autoplaySpeed={2800} className="carousel-container">
        <div>
          <div className="carousel slider2">
            <div className="sl-text-container"></div>
          </div>
        </div>
        <div>
          <div className="carousel slider3">
            <div className="sl-text-container"></div>
          </div>
        </div>
        <div>
          <div className="carousel slider4">
            <div className="sl-text-container"></div>
          </div>
        </div>
      </Carousel>
      <div
        style={{
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Image src={tickAsset} preview={false} style={{ maxWidth: 100 }} />
        <Typography.Text
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#555',
            textAlign: 'center',
          }}
        >
          &reg; Bản quyền thuộc về công ty cổ phần Dịch vụ Tài chính
          <br /> PVFC FINANCE GROUP
        </Typography.Text>
      </div>
    </motion.div>
  );
}
const Tab = ({ title, onClick, icon }) => {
  return (
    <motion.div
      whileTap={{
        scale: 0.96,
        opacity: 0.3,
        border: '1px solid #006ead',
      }}
      onClick={onClick}
      style={{
        margin: '10px 0px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 15px',
        border: '1px solid #006ead',
        borderRadius: 5,
      }}
    >
      <Typography.Text
        style={{ flex: 1, fontSize: 16, color: '#006ead', fontWeight: 500 }}
      >
        {title}
      </Typography.Text>
      {icon}
    </motion.div>
  );
};
