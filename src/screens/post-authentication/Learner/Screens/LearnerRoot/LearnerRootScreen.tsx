import { FloatButton, Layout, Typography } from 'antd'
import { Learner, Store, Utils } from '@adewaskar/lms-common'
import { useEffect, useMemo } from 'react'

import ActionModal from '@Components/ActionModal'
import AppProvider from 'screens/AppProvider'
import CreateTicket from '../Tickets/CreateTicket'
import { CustomerServiceOutlined } from '@ant-design/icons'
import LearnerHeader from './LearnerHeader'
import ThemeProvider from 'screens/ThemeProvider'
import useBreakpoint from '@Hooks/useBreakpoint'
import useDynamicFont from '@Hooks/useDynamicFont'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

const { Title } = Typography
const LearnerRootScreen: React.FC = () => {
  const { orgId } = useParams()
  const [params] = useSearchParams()
  const userAuthToken = params.get('userAuthToken')
  // const organisation = Store.useGlobal(s => s.organisation)
  // console.log(organisation, 'organisation')
  // // @ts-ignore
  // const branding = organisation.branding
  useEffect(
    () => {
      if (userAuthToken) {
        Utils.Storage.SetItem('userType', `learner`)
        Utils.Storage.SetItem('learner-auth-token', userAuthToken)
      }
    },
    [userAuthToken]
  )

  const { isSignedIn } = Store.useAuthentication(s => s)

  useEffect(
    () => {
      if (orgId) {
        Utils.Storage.SetItem('orgId', orgId + '')
      }
    },
    [orgId]
  )
  // const { branding } = Store.useGlobal(s => s.organisation);

  // const { isLoading } = useDynamicFont({
  //   fontName: branding.font.name,
  //   fontUrl: branding.font.url
  // });
  const { isMobile } = useBreakpoint()
  let subdomain = useMemo(
    () => {
      const hostname = window.location.hostname
      const parts = hostname.split('.')
      const subdomain = parts.length > 2 ? parts[0] : null
      return subdomain
    },
    [window.location.hostname]
  )
  const setOrganisation = Store.useGlobal(s => s.setOrganisation)

  const userType = Utils.Storage.GetItem('userType')
  // const { isInitDone } = useAppInit(userType, !!isAliasValid)

  // useEffect(() => {
  //   const sd = subdomain + ''
  //   Learner.Api.ValidateOrgAlias(sd)
  //     .then(organisation => {
  //       setAliasValid(true)
  //       Utils.Storage.SetItem('orgAlias', sd)
  //       setOrganisation(organisation)
  //     })

  //     .catch(() => {
  //       console.log('invalid')
  //       setAliasValid(false)
  //     })
  // }, [])

  return (
    <ThemeProvider type="learner">
      <AppProvider>
        {isSignedIn ? (
          !isMobile ? (
            <ActionModal
              width={600}
              title={
                <Title style={{ marginTop: 0 }} level={3}>
                  Raise a ticket
                </Title>
              }
              cta={
                <FloatButton
                  style={{ width: 60, height: 60 }}
                  shape="circle"
                  type="primary"
                  icon={<CustomerServiceOutlined size={5600} />}
                />
              }
            >
              <CreateTicket />
            </ActionModal>
          ) : null
        ) : null}
        <Layout>
          <LearnerHeader />
        </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default LearnerRootScreen
