import React from 'react'
import { motion } from 'framer-motion'
import { Typography } from 'antd'
export default function Splash() {
  return (
    <motion.div className="center-frame" style={{ background: '#044bb0' }}>
      <motion.div initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 0.8 }}>
        <Typography.Text strong style={{ color: '#fff', fontSize: 50 }}>
          VAY 24H
        </Typography.Text>
      </motion.div>
    </motion.div>
  )
}
