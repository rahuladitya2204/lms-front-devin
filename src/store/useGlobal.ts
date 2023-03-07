import { GetOrganisationDetails } from '@User/Api'
import { INITIAL_ORG_DETAILS } from 'constant.ts'
import { Organisation } from '@Types/Organisation'
import create from 'zustand'

interface GlobalState {
  organisation: Organisation;
  setOrganisation: (organisation: Organisation) => void,
  fetchOrganisation: (id:string)=>Promise<void>
  }

const useGlobal = create<GlobalState>(set => ({
  organisation: INITIAL_ORG_DETAILS,
  setOrganisation: (organisation) => set(state => ({ organisation: organisation })),
  fetchOrganisation:async (orgId:string) => {
    await GetOrganisationDetails(orgId)
        .then(data => set({organisation: data}))
}
}))

export default useGlobal
