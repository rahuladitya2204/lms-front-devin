import AffiliateProducts from './AffiliateProducts/AffiliateProducts'
import AffiliateProgramForm from './AffiliateProgramForm'
import { Card } from 'antd'
import Header from '@Components/Header'
import Tabs from '@Components/Tabs'

export default function AffiliateProgramScren () {
  return (
    <Header>
      <Card title='Affiliate Program' >
        <Tabs
          items={[
            {
              key: 'program',
              label: 'Program Detail',
              children: <AffiliateProgramForm />
            },
            {
              key: 'products',
              label: 'Products',
              children: <AffiliateProducts />
            }
          ]}
        />
      </Card>
    </Header>
  )
}
