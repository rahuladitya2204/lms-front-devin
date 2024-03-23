import {
  Button,
  Card,
  Col,
  Form,
  Layout,
  Row,
  Skeleton,
  Spin,
  Tag,
  Tooltip,
} from 'antd'
import { Learner, Utils } from '@adewaskar/lms-common'
import { Navigate, useNavigate } from 'react-router'

import AffiliateDashboard from './AffiliateDashboard'
import AffiliateForm from './AffiliateForm'
import AffiliateProducts from './AffiliateProducts'
import CoinImage from '../Account/LearnerWallet/CoinImage'
import Header from '@Components/Header'
import LearnerHeader from '../LearnerRoot/LearnerHeader'
import Tabs from '@Components/Tabs'
import { Typography } from '@Components/Typography'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'

const { Title, Text } = Typography

export default function AffiliateScreen () {
  const navigate = useNavigate()
  const {
    data: learner,
    isLoading: loadingDetails
  } = Learner.Queries.useGetLearnerDetails()
  const {
    data: affiliateDetails,
    isLoading: loadingAffiliateDetails
  } = Learner.Queries.useGetAffiliateAccountDetails({
    enabled: !!learner.affiliate
  })
  const { isDesktop, isMobile } = useBreakpoint()
  const wallet = affiliateDetails.wallet
  const Balance = Utils.UnitTypeToStr(wallet.balance)
  const WalletButton = (
    <Tooltip
      title={
        !wallet.balance.value
          ? 'No amount available for payout'
          : `Wallet Balance: ${Balance}`
      }
    >
      <Spin spinning={loadingAffiliateDetails}>
        <Button
          style={{ paddingTop: 2, paddingLeft: 5 }}
          color="blue-inverse"
          // size={screen.isMobile?'small':'middle'}
        >
          <Row justify={'center'} align={'middle'}>
            <Col style={{ marginTop: -1 }}>
              <CoinImage width={20} />
            </Col>
            <Col>
              <Text style={{ fontSize: 16, marginLeft: 5 }} strong>
                {' '}
                {Balance}
              </Text>
            </Col>
          </Row>
        </Button>
      </Spin>
    </Tooltip>
  )

  return (
    <Spin spinning={loadingDetails}>
      <Header
        onLogoClick={() => navigate('../app/store')}
        // showBack
        showLogo
        title="Affiliate Program"
        extra={isMobile ? [] : [WalletButton]}
      >
        {isMobile ? (
          <Row
            align={'middle'}
            justify={'space-between'}
            style={{ marginBottom: 10 }}
          >
            <Col>
              <Title style={{ margin: 0 }} level={4}>
                Wallet Balance
              </Title>
            </Col>
            <Col>{WalletButton}</Col>
          </Row>
        ) : null}
        <Card style={{ minHeight: '100vh' }}>
          {loadingDetails ? (
            <Skeleton />
          ) : (
            <Tabs
              navigateWithHash
              style={{ minHeight: '100vh' }}
              tabPosition={isDesktop ? 'left' : 'top'}
              items={
                !learner.affiliate
                  ? [
                    {
                      label: 'Registration',
                      key: 'register',
                      children: <AffiliateForm />
                    }
                  ]
                  : [
                    {
                      label: 'Dashboard',
                      key: 'dashboard',
                      children: <AffiliateDashboard />
                    },
                    {
                      label: 'Products',
                      key: 'products',
                      children: <AffiliateProducts />
                    }
                  ]
              }
            />
          )}
        </Card>
      </Header>
    </Spin>
  )
}
