import { useNavigate } from 'react-router'

function BackButton(props: { children: React.ReactNode }) {
  const navigate = useNavigate()
  return <span onClick={() => navigate(-1)}>{props.children}</span>
}

export default BackButton
