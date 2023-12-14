import { Button, Modal } from 'antd'
import { Constants, Learner, Store } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import AppImage from './Image'
import styled from 'styled-components'

const AppModal = styled(Modal)`
  .ant-modal-content,
  .modal-title {
    background-color: transparent;
    box-shadow: none;
  }
  .ant-modal-footer {
    display: none;
  }
  .ant-modal-close {
    top: -5px;
    color: #fff;
  }
`

interface BannerPropsI {}
export default function Banner(props: BannerPropsI) {
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn)
  const { data: { banners } } = Learner.Queries.useGetOrgDetails()
  const [banner, setBanner] = useState(Constants.INITIAL_BANNER_DETAILS)
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(
    () => {
      if (isSignedIn && banners.length) {
        setTimeout(() => {
          setBanner(banners[0])
          setIsModalVisible(true)
        }, 3000)
      }
    },
    [isSignedIn, banners]
  )

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <AppModal
      closable
      //   title="Welcome"
      bodyStyle={{ background: 'transparent' }}
      visible={isModalVisible}
      //   onOk={handleOk}
      onCancel={handleCancel}
    >
      <AppImage src={banner.image} />
    </AppModal>
  )
}
