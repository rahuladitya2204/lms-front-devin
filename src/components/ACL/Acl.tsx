import { Constants, Enum, Types, User } from '@adewaskar/lms-common'

import { compareArrays } from '@Components/SunEditor/utils'

interface AclComponentPropsI {
  permissions: Types.UserRolePermission[];
  children: React.ReactNode;
}

export default function AclComponent(props: AclComponentPropsI) {
  const { permissions, isAdmin } = useGetUserPermissions()
  // @ts-ignore
  if (compareArrays(permissions, props.permissions) || isAdmin) {
    return props.children
  } else {
    return null
  }
}

export const useGetUserPermissions = () => {
  const { data: { roles } } = User.Queries.useGetUserDetails()
  const permissions = roles
    .map(r => Constants.USER_ROLES.find(r => r.slug === r.slug)?.permissions)
    .flat()
  return {
    permissions,
    isAdmin: roles.find(r => r === Enum.UserRole.ADMIN)
  }
}
