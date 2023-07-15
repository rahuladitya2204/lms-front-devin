import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { Card } from 'antd'

const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }]

export default function PaidUsers () {
  const renderLineChart = (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  )
  return (
      <LineChart
        width={400}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
  )
}
