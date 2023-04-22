// @ts-nocheck
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tabs,
  Tag
} from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import AddRecipients from './AddRecipients/AddReciepients'
import CampaignForm from './CampaignForm/CampaignForm'
import CreateEmailTemplate from './CreateTemplate/CreateEmailTemplate'
import Header from '@Components/Header'
import Stepper from '@Components/Stepper'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

interface CreateCampaignComponentPropsI {
  children?: ReactNode;
  data?: Partial<Types.Campaign>;
  onFinish?: Function;
}

const CreateCampaign: React.FC<CreateCampaignComponentPropsI> = props => {
  const data = props.data || Constants.INITIAL_CAMPAIGN_DETAILS
  const params = useParams()
  const navigate = useNavigate()
  const [operator, setOperator] = useState('$or')
  const message = useMessage()
  const {
    mutate: createCampaign,
    isLoading: createCampaignLoading
  } = User.Queries.useCreateCampaign()
  const {
    mutate: updateCampaignApi,
    isLoading: updateCampaignLoading
  } = User.Queries.useUpdateCampaign()

  const { data: campaignDetails } = User.Queries.useGetCampaignDetails(
    params.id + '',
    {
      enabled: !!params.id
    }
  )

  const [form] = Form.useForm()
  const isFormValid = !form.getFieldsError().some(({ errors }) => errors.length)

  const [campaign, setCampaign] = useState(Constants.INITIAL_CAMPAIGN_DETAILS)

  useEffect(
    () => {
      setCampaign(campaignDetails)
    },
    [campaignDetails]
  )

  const updateCampaign = (e: Partial<Types.Campaign>) => {
    setCampaign({
      ...campaign,
      ...e
    })
  }

  const onSubmit = () => {
    if (!isFormValid) {
      return
    }
    const data = {
      ...campaign,
      status: 'draft'
    }
    if (campaign._id) {
      updateCampaignApi(
        { id: campaign._id, data: data },
        {
          onSuccess: r => {
            message.open({
              type: 'success',
              content: 'Campaign Draft Saved'
            })
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
          form.resetFields()
          setRules([])
        }
      })
    }
    // onFinish && onFinish(e)
  }

  useEffect(
    () => {
      form.setFieldsValue(data)
    },
    [data]
  )

  return (
    <Header
      title="Create Campaign"
      extra={[
        <Button
          disabled={!isFormValid}
          loading={createCampaignLoading || updateCampaignLoading}
          onClick={onSubmit}
        >
          Save Draft{' '}
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
                      defaultActiveKey="1"
                      items={[
                        {
                          key: '1',
                          label: `Email`,
                          children: (
                            <CreateEmailTemplate
                              updateCampaign={updateCampaign}
                              campaign={campaign}
                            />
                          )
                        }
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
