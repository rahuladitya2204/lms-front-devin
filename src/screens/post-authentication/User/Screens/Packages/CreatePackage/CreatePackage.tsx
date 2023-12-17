import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Tag,
  Typography,
} from 'antd'
import { Enum, Types, Utils } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal'
import CreatePlan from '@User/Screens/ExtraComponents/CreatePlan'
import Header from '@Components/Header'
import PackageDetails from './PackageDetails/PackageDetails'
import PackageLandingPageEditor from './PackageLandingPage/PackageLandingPageEditor'
import PackagePlan from './PackagePricing'
import PackagePricing from './PackagePricing'
import Products from './PackageDetails/Products/Products'
import Tabs from '@Components/Tabs'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

const { confirm} = Modal;
interface CreatePackageComponentPropsI {
  // data: Types.Package;
  children?: ReactNode;
  closeModal?: Function;
  onSuccess?: () => void;
  onFinish?: (data: Types.Package) => void;
}

const CreatePackage: React.FC<CreatePackageComponentPropsI> = props => {
  const { packageId } = useParams();
  const isEdit = !!packageId;
  const navigate = useNavigate();
  const {
    mutate: createPackage,
    isLoading: createPackageLoading
  } = User.Queries.useCreatePackage()
  const {
    mutate: updatePackage,
    isLoading: updatePackageLoading
  } = User.Queries.useUpdatePackage();
  const message = useMessage();
  const {mutate:publishPackage,isLoading:publishingPackage } = User.Queries.usePublishPackage();
  const {mutate:unpublishPackage,isLoading:unpublishingPackage } = User.Queries.useUnpublishPackage();
  const {data: packageDetails,isLoading: loadingPackage}=User.Queries.useGetPackageDetails(packageId+'',{
    enabled:!!packageId
  })
  useEffect(() => { 
    console.log(packageDetails,'packageDetailspackageDetails')
    form.setFieldsValue(packageDetails)
  },[packageDetails])

  const [form] = Form.useForm<Types.Package>()

  const onSubmit = (e: Types.Package) => {
    const data= {
      ...e,
    }
    if (isEdit) {
      updatePackage(
        { id: packageId, data:data },
        {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: 'Package updated'
            })
          }
        }
      )
    } else {
      // @ts-ignore
      createPackage(
        { data:data },
         {
        onSuccess: () => {
            //  navigate('../');
             message.open({
              type: 'success',
              content: 'Package Created'
            })
          props.onSuccess && props.onSuccess();
             props.closeModal && props.closeModal();
        }
      })
    }
  }
  const plan = packageDetails.plan as unknown as Types.Plan
  const isPackageValid = Utils.validatePublishPackage(packageDetails);
  const PublishPackage = <Button
    loading={publishingPackage}
    key="submit"
    type="primary"
    onClick={() => {
      confirm({
        title: 'Are you sure?',
        content: `You want to publish this package?`,
        onOk() {
          publishPackage({
            packageId: packageId + ''
          })
        },
        okText: 'Yes, Publish'
      })
    }}
  >
    Publish Package
  </Button>;
  const UnpublishPackage=<Button  style={{marginRight:10}}  onClick={() => {
    confirm({
      title: 'Are you sure?',
      content: `You want to unpublish this package? Will be moved to Draft`,
      onOk() {
        unpublishPackage({
          packageId: packageId + ''
        })
      },
      okText: 'Yes, Publish'
    })
  }}>Revert to Draft</Button>
  const SavePackage = <Button style={{ marginLeft: 10 }}
    loading={createPackageLoading || updatePackageLoading}
    key="submit"
    type="primary"
    onClick={form.submit}
  >
    Save Details
  </Button>;
  console.log(isPackageValid,'isPackageValid')
  return (
    <Header onBack={()=>navigate('../')} title='Create Package' extra={[
      ...(packageDetails.status===Enum.PackageStatus.PUBLISHED?[UnpublishPackage,<Tag color='green'>Published</Tag>]:[]),
      (isPackageValid && (packageDetails.status !== Enum.PackageStatus.PUBLISHED))?PublishPackage:null,
      SavePackage]}>
      {/* <Spin  spinning={loadingPackage}> */}
      <Card>
      <Row gutter={[20,30]}>
        <Col span={24}>
      <>
              <Form form={form} onFinish={onSubmit} layout="vertical">
                <Tabs navigateWithHash items={[
                  {
                    label: 'Details',
                    key: "details",
                    children:<PackageDetails packageId={packageId+''} />
                    },
                    {
                      label: 'Products',
                      key: "products",
                      children:<Products />
                    },
                  {
                    label: 'Landing Page',
                    key: "landing-page",
                    children:<PackageLandingPageEditor packageId={packageId+''} />
                  },
                  {
                    label: 'Pricing',
                    key: "pricing",
                    children:<PackagePricing packageId={packageId+''} />
                    }
              ]} />

    </Form>
            </>
        </Col>

    </Row>
    </Card>
      {/* </Spin> */}
    </Header>
  )
}

export default CreatePackage
