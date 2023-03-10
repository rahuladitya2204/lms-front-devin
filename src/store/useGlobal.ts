import { Constants, Types } from '@adewaskar/lms-common'

import { GetOrganisationDetails } from '@User/Api'
import create from 'zustand'

// console.log(goodBye, 'goodBye')
interface GlobalState {
  organisation: Types.Organisation;
  setOrganisation: (organisation: Types.Organisation) => void;
  fetchOrganisation: (id: string) => Promise<void>;
}

const useGlobal =
  create <
  GlobalState >
  (set => ({
    organisation: Constants.INITIAL_ORG_DETAILS,
    setOrganisation: organisation =>
      set(state => ({ organisation: organisation })),
    fetchOrganisation: async (orgId: string) => {
      await GetOrganisationDetails(orgId).then(data =>
        set({ organisation: data })
      )
    }
  }))

export default useGlobal
