import PackageOverview from './PackageOverview'
import PackageProducts from './PackageProducts'
import Tabs from '@Components/Tabs'
import { Types } from '@adewaskar/lms-common'

interface PackageDetailsPropsI {
  package: Types.Package;
}

function PackageDetails(props: PackageDetailsPropsI) {
  return (
    <Tabs
      navigateWithHash
      items={[
        {
          key: 'overview',
          label: `Overview`,
          children: <PackageOverview package={props.package} />
        },
        {
          key: 'products',
          label: `What's included`,
          children: <PackageProducts package={props.package} />
        }
        // {
        //   key: 'reviews',
        //   label: `Reviews`,
        //   children: <PackageReviews package={props.package} />
        // }
      ]}
      style={{ fontSize: 30 }}
      size="middle"
    />
  )
}

export default PackageDetails
