// @ts-nocheck
import { Button, Card, Col, Modal, Row, Tabs } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import React, { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import AddRecipients from './AddRecipients/AddReciepients'
import CampaignForm from './CampaignForm/CampaignForm'
import CreateEmailTemplate from './CreateTemplate/CreateEmailTemplate'
import CreateWhatsappTemplate from './CreateTemplate/CreateWhatsappTemplate'
import Header from '@Components/Header'
import Stepper from '@Components/Stepper'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

const { confirm } = Modal
interface CreateCampaignComponentPropsI {
  children?: ReactNode;
  data?: Partial<Types.Campaign>;
  onFinish?: Function;
}

const CreateCampaign: React.FC<CreateCampaignComponentPropsI> = props => {
  const { id } = useParams()
  const params = useParams()
  const navigate = useNavigate()
  const message = useMessage()
  const {
    mutate: createCampaign,
    isLoading: createCampaignLoading
  } = User.Queries.useCreateCampaign()
  const {
    mutate: updateCampaignApi,
    isLoading: updateCampaignLoading
  } = User.Queries.useUpdateCampaign()

  const {
    mutate: executeCampaign,
    isLoading: initiatingExecution
  } = User.Queries.useExecuteCampaign()

  const { data: campaignDetails } = User.Queries.useGetCampaignDetails(
    params.id + '',
    {
      enabled: !!params.id
    }
  )

  const [campaign, setCampaign] = useState(Constants.INITIAL_CAMPAIGN_DETAILS)

  useEffect(
    () => {
      if (campaignDetails._id) {
        setCampaign(campaignDetails)
      }
    },
    [campaignDetails]
  )

  const updateCampaign = (e: Partial<Types.Campaign>) => {
    setCampaign({
      ...campaign,
      ...e
    })
  }

  const saveDraft = (cb?: Function) => {
    // if (!isFormValid) {
    //   return
    // }
    const data = {
      ...campaign,
      status: 'draft'
    }
    if (campaign._id) {
      updateCampaignApi(
        { id: campaign._id, data: data },
        {
          onSuccess: r => {
            if (cb) {
              cb()
            } else {
              message.open({
                type: 'success',
                content: 'Campaign Draft Saved'
              })
            }

            // navigate('../campaign')
          }
        }
      )
    } else {
      createCampaign(data, {
        onSuccess: r => {
          message.open({
            type: 'success',
            content: 'Saved'
          })
          navigate('../campaign')
          setRules([])
        }
      })
    }
    // onFinish && onFinish(e)
  }
  return (
    <Header
      showBack
      title="Create Campaign"
      extra={[
        <Button
          // disabled={!isFormValid}
          loading={createCampaignLoading || updateCampaignLoading}
          onClick={saveDraft}
        >
          Save Draft
        </Button>,
        <Button
          type="primary"
          loading={initiatingExecution}
          onClick={() => {
            confirm({
              title: 'Are you sure?',
              // icon: <ExclamationCircleOutlined />,
              content: `You want to execute this campaign?`,
              onOk() {
                saveDraft(() => {
                  executeCampaign({ id })
                })
              },
              okText: 'Delete File'
            })
          }}
        >
          Execute Campaign
        </Button>
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Stepper
              steps={[
                {
                  title: 'Title',
                  content: (
                    <CampaignForm
                      updateCampaign={updateCampaign}
                      campaign={campaign}
                    />
                  )
                },
                {
                  title: 'Recipients',
                  content: (
                    <AddRecipients
                      updateCampaign={updateCampaign}
                      campaign={campaign}
                    />
                  )
                },
                {
                  title: 'Template',
                  content: (
                    <Tabs
                      defaultActiveKey="1234321"
                      items={[
                        campaign.channel.includes('email')
                          ? {
                              key: 'email',
                              label: `Email`,
                              children: (
                                <CreateEmailTemplate
                                  updateCampaign={updateCampaign}
                                  campaign={campaign}
                                />
                              )
                            }
                          : null,
                        campaign.channel.includes('whatsapp')
                          ? {
                              key: 'whatsapp',
                              label: `Whatsapp`,
                              children: (
                                <CreateWhatsappTemplate
                                  updateCampaign={updateCampaign}
                                  campaign={campaign}
                                />
                              )
                            }
                          : null
                      ]}
                    />
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Header>
  )
}

export default CreateCampaign
