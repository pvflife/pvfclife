import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LeftOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  WifiOutlined,
  PayCircleOutlined,
  RightOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';

import {
  Typography,
  Slider,
  Table,
  Modal,
  Popconfirm,
  message,
  Image,
  Input,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _cardbg from '../../assets/card.png';
import _whitelogo from '../../assets/logo-non-color.png';
import api from '../../api';
import useNotification from '../../hooks/useNotification';
import * as actions from '../../redux/actions/auth';
import connectCSKH from '../../utils/connectCSKH';
import CurrencyInput from 'react-currency-input-field';
import walletImage from '../../assets/wallet.jpg';
import './Wallet.scss';
import moment from 'moment';
import _ from 'lodash'
export default function Wallet() {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const { profile } = useSelector((state) => state._auth);
  const { notifications, pushNotifications } = useNotification();
  const history = useHistory();
  const dispatch = useDispatch();
  const [currentRequest, setCurrentRequest] = useState({});
  const [OTP, setOTP] = useState('');
  const [visibleOTP, setVisibleOTP] = useState(false);
  useEffect(() => {
    // (async () => {
    //   const { data } = await api.get('/users/profile');
    //   dispatch(actions.initialLogin(data.data));
    //   loadCurrentRequest()
    // })();
    loadProfile()
  }, [notifications]);

  const loadProfile = async () => {
    const { data } = await api.get('/users/profile');
    dispatch(actions.initialLogin(data.data));
    loadCurrentRequest()
  }

  const loadCurrentRequest = async () => {
    try {
      const { data } = await api.get('/requests/lasted');
      setCurrentRequest(data?.data ? data.data : {})
    } catch (error) {
      setCurrentRequest({})
      console.log(error);
    }
  }

  const [contract, setContract] = useState({});
  const [visible, setVisible] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const onConfirmWithdraw = async (e) => {
    if (!currentRequest) {
      message.error('L???y th??ng tin y??u c???u th???t b???i, vui l??ng th??? l???i sau!');
      return;
    }

    if (profile.balance === 0) {
      message.error('S??? d?? kh??? d???ng kh??ng ?????');
      return;
    }

    const contracts = await api.get('/contracts');

    if (contracts.data.data[0]) {
      // requestResult = contract
      const requestResult = await api.post('/requests', {
        amount: e,
        contractId: contracts.data.data[0]._id,
        bank_reciever: {
          name: profile?.kyc?.bank.name,
          number: profile?.kyc?.bank.number,
          bankName: profile?.kyc?.bank.bankName,
        },
      });
      setContract(requestResult.data)

      pushNotifications({
        message: `${profile.phone} y??u c???u r??t ti???n`,
        description: `Kh??ch ??ang t???o y??u c???u r??t ti???n : ${profile.balance.toLocaleString()}`,
      });
      loadProfile()
      setVisible(true);
      setIsDone(requestResult.data.response === 'accepted')
      return requestResult;
    } else {
      message.error('B???n ch??a c?? h???p ?????ng vay, vui l??ng ????ng k?? v?? ho??n thi???n h??? s?? vay tr?????c!');
      return;
    }
  };

  const onClickVerify = async (e) => {
    try {
      const contracts = await api.get('/contracts');
      setContract(contracts.data.data[0]);
      const requestResult = await api.post('/requests/verify', {
        id: currentRequest._id,
        error: contracts?.data?.data[0].response || '',
        otp: OTP,
        status: contracts.data.data[0].response === 'accepted' ? 'accepted' : 'rejected'
      });

      loadProfile()
      setOTP('')
      // setVisible(contracts.data.data[0].response !== 'accepted');
      setIsDone(contracts.data.data[0].response === 'accepted')
      setVisible(true)
    } catch (error) {
      console.log(error);
    }
  };

  const [isConfirm, setIsConfirm] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0.3, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="header-container">
        <div />
        <Typography.Text
          strong
          style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}
        >
          V?? ti???n
        </Typography.Text>
        <div></div>
      </div>
      <div style={{ padding: 10 }}>
        <Card
          data={profile}
          balance={profile?.balance}
          onWithdraw={(e) => onConfirmWithdraw(e)}
          currentRequest={currentRequest}
          setVisibleOTP={setVisibleOTP}
        />
        <motion.div whileTap={{ scale: 0.97, opacity: 0.3 }}>
          <Item
            text="R??t ti???n v??? t??i kho???n li??n k???t"
            icon={<PayCircleOutlined className="pay-circle" />}
            onClick={
              profile?.kyc?.status
                ? () => onConfirmWithdraw(profile?.balance)
                : () => message.info('B???n c???n x??c minh danh t??nh.')
            }
          />
        </motion.div>
        {
          !_.isEmpty(currentRequest) &&
          <div className='request-detail'>
            <div className="title-detail">Chi Ti???t Gi???i Ng??n</div>
            <table>
              <tr>
                <td>Th???i gian r??t ti???n</td>
                <td>{moment(currentRequest.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
              </tr>
              <tr>
                <td>Th???c r??t v??? t??i kho???n</td>
                <td>{currentRequest.amount ? currentRequest.amount.toLocaleString() + ' VND' : ''}</td>
              </tr>
              <tr>
                <td>Tr???ng th??i r??t ti???n</td>
                <td>{renderStatus(currentRequest.status)}</td>
              </tr>
              <tr>
                <td>Ghi ch??</td>
                <td>{currentRequest.error}</td>
              </tr>
            </table>
          </div>
        }

        <Image
          src={walletImage}
          style={{ padding: 5, borderRadius: 10 }}
          preview={false}
        />
      </div>
      <Modal
        visible={visible}
        title={null}
        footer={null}
        closable={true}
        onCancel={() => {
          setVisible(false);
          setIsConfirm(false);
        }}
        destroyOnClose
      >
        <div className="verifying">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {isDone ? (
              <>
                <CheckOutlined style={{ color: '#40eb31', fontSize: 40 }} />
                <Typography.Text
                  style={{
                    color: '#333',
                    fontSize: 19,
                    textAlign: 'center',
                    paddingVertical: 10,
                  }}
                >
                  R??t ti???n th??nh c??ng !
                </Typography.Text>
                <Typography.Text
                  style={{ color: '#777', fontSize: 15, textAlign: 'center' }}
                >
                  L???nh chuy???n ti???n ???? ???????c th???c hi???n. Vui l??ng ch??? ti???n v??? STK
                  ???? li??n k???t! Th???i gian d??? ki???n 30 ph??t!
                </Typography.Text>
              </>
            ) : (
              <>
                {contract?.response ==
                  'accepted' ? (
                  <>
                    <CheckCircleOutlined
                      style={{ fontSize: 50, color: 'green' }}
                    />
                    <Typography.Text
                      style={{
                        color: '#777',
                        fontSize: 17,
                        color: 'green',
                        textAlign: 'center',
                        padding: 10,
                      }}
                    >
                      {contract.status == 'pending'
                        ? '??ang x??t duy???t'
                        : contract?.response}
                    </Typography.Text>
                  </>
                ) : (
                  <>
                    <ExclamationCircleOutlined
                      style={{ fontSize: 50, color: '#eb314a' }}
                    />
                    <Typography.Text style={{ color: '#777', fontSize: 17 }}>
                      T??? ch???i y??u c???u
                    </Typography.Text>
                    <Typography.Text
                      style={{ color: '#777', fontSize: 17, color: '#eb314a' }}
                    >
                      {contract.status == 'pending'
                        ? '??ang x??t duy???t'
                        : contract?.response}
                    </Typography.Text>
                  </>
                )}

                <Typography.Text style={{ color: '#777', fontSize: 17 }}>
                  Li??n h??? CSKH tr???c tuy???n ????? ???????c h??? tr???
                </Typography.Text>
                <br />

                {/* <motion.div
                  whileTap={{ opacity: 0.4, scale: 0.97 }}
                  style={{
                    background: '#002dbf',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    padding: 5,
                  }}
                  onClick={connectCSKH}
                >
                  <Typography.Text
                    style={{ fontSize: 17, color: '#fff', fontWeight: 'bold' }}
                  >
                    ???n v??o ????y ????? li??n h??? CSKH
                  </Typography.Text>
                </motion.div> */}
              </>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        visible={visibleOTP}
        title={'OTP'}
        footer={null}
        closable={true}
        onCancel={() => setVisibleOTP(false)}
        destroyOnClose
      >
        <div className="withdraw-money-container">
          <Input
            className="input-currency"
            placeholder="Nh???p m?? OPT c???a b???n"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <motion.div
              whileTap={{ opacity: 0.4, scale: 0.97 }}
              className="check-amount"
              onClick={() => {
                setVisibleOTP(false);
                onClickVerify();
              }}
            >
              <Typography.Text
                style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}
              >
                Ti???p t???c
              </Typography.Text>
            </motion.div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

function Card({ data, balance, onWithdraw, currentRequest, setVisibleOTP }) {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [showMoney, setShowMoney] = useState(true);
  const [showBankAccount, setShowBankAccount] = useState(false);
  return (
    <motion.div
      style={{ padding: 5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            borderRadius: 5,
            width: '100%',
            height: 200,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundImage: `url(${_cardbg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div className="card-head-img">
            <div style={{}}>
              {data?.kyc?.bank?.logo ? (
                <Image
                  src={data?.kyc?.bank?.logo}
                  width="50%"
                  preview={false}
                />
              ) : (
                <WifiOutlined
                  style={{
                    fontSize: 26,
                    color: '#fff',
                    fontWeight: 'bold',
                    transform: 'rotate(90deg)',
                  }}
                />
              )}
            </div>
          </div>
          <div
            style={{
              padding: 10,
              justifyContent: 'flex-start',
              minWidth: '100%',
            }}
          >
            <div className="atm-card-information" style={{ position: 'relative' }}>
              {data?.kyc?.bank?.number ? (
                <>
                  <div style={{ position: 'absolute', top: 0, right: '10px' }}>
                    {showBankAccount ? (
                      <EyeOutlined
                        onClick={() => setShowBankAccount((prev) => !prev)}
                        className="eye-icon"
                      />
                    ) : (
                      <EyeInvisibleOutlined
                        onClick={() => setShowBankAccount((prev) => !prev)}
                        className="eye-icon"
                      />
                    )}
                  </div>

                  <Typography.Text className="atm-card-text" >
                    {data?.kyc?.bank?.number
                      ?
                      showBankAccount ? `${data.kyc.bank.number}` : `********` + data.kyc.bank.number.substring(data.kyc.bank.number.length - 4)
                      : ''}
                  </Typography.Text>
                  <Typography.Text className="atm-card-text">
                    {data?.kyc?.bank?.name}
                  </Typography.Text>
                </>
              ) : (
                <Typography.Text className="atm-card-text">
                  Ch??a ????ng k??
                </Typography.Text>
              )}
            </div>
          </div>
        </div>
      </div>
      <motion.div
        className="check-amount-container"
        onClick={() => {
          // console.log('onClick', currentRequest);
          // if (currentRequest && currentRequest.status === 'pending') {
          //   setVisibleOTP(true)
          //   return
          // }
          setVisible(true)
        }}
      >
        <motion.div style={{}} whileTap={{ opacity: 0.3 }}>
          <Typography.Text
            style={{ fontSize: 15, color: '#333', fontWeight: '600' }}
          >
            S??? d?? v?? :
          </Typography.Text>
          <br />
          <div />
        </motion.div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          {showMoney ? (
            <EyeOutlined
              onClick={() => setShowMoney((prev) => !prev)}
              className="eye-icon"
            />
          ) : (
            <EyeInvisibleOutlined
              onClick={() => setShowMoney((prev) => !prev)}
              className="eye-icon"
            />
          )}
          <br />
          <Typography.Text
            style={{ fontSize: 17, color: '#d8261a', fontWeight: 700 }}
          >
            {showMoney ? `${data?.balance?.toLocaleString()}  VND` : '******'}{' '}
          </Typography.Text>
        </div>
      </motion.div>
      <a
        onClick={() => history.push('/history')}
        style={{ textDecoration: 'underline', margin: 5 }}
      >
        Bi???n ?????ng s??? d??
      </a>
      <Modal
        visible={visible}
        title={'R??t ti???n'}
        footer={null}
        closable={true}
        onCancel={() => setVisible(false)}
        destroyOnClose
      >
        <div className="withdraw-money-container">
          <CurrencyInput
            className="input-currency"
            min={0}
            max={balance}
            placeholder="Nh???p s??? ti???n r??t"
            decimalsLimit={2}
            onValueChange={(value, name) => setAmount(parseInt(value))}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <motion.div
              whileTap={{ opacity: 0.4, scale: 0.97 }}
              className="check-amount"
              onClick={() => {
                if (amount > data?.balance) {
                  message.info('Kh??ng th??? cao h??n m???c kh??? d???ng');
                  return;
                }

                setVisible(false);
                onWithdraw(amount);
              }}
            >
              <Typography.Text
                style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}
              >
                Ti???p t???c
              </Typography.Text>
            </motion.div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
const Item = ({ text = 'title', icon, onClick = () => { } }) => {
  return (
    <div className="item" onClick={onClick}>
      <Typography.Text
        style={{ flex: 1, fontSize: 16, paddingLeft: 20, color: '#fff' }}
        strong
      >
        {text}
      </Typography.Text>
      <VerticalAlignBottomOutlined style={{ color: '#fff', fontSize: 30 }} />
    </div>
  );
};

const renderStatus = (status) => {
  switch (status) {
    case 'pending':
      return '??ang x??t duy???t'
    case 'accepted':
      return 'Th??nh c??ng'
    case 'rejected':
      return 'B??? t??? ch???i'
  }
  return ''
}