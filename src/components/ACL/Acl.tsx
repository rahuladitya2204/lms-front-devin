import { Constants, Types, User } from '@adewaskar/lms-common'

interface AclComponentPropsI {
  permissions: Types.UserRolePermission[];
  children: React.ReactNode;
}

export default function AclComponent(props: AclComponentPropsI) {
  const PERMISSIONS = useGetUserPermissions()
  // @ts-ignore
  if (PERMISSIONS.includes(props.permissions)) {
    return props.children
  } else {
    return null
  }
}

export const useGetUserPermissions = () => {
  const { data: { roles } } = User.Queries.useGetUserDetails()
  const PERMISSIONS = roles
    .map(r => Constants.USER_ROLES.find(r => r.slug === r.slug)?.permissions)
    .flat()
  return PERMISSIONS
}
