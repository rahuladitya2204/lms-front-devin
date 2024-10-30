import { axiosTestInstance } from "../support/commands"

describe('_BeforeAll', () => {
    before(async () => {
        await axiosTestInstance({ method: 'POST', url: 'user/test/create-test-learner' })
        await axiosTestInstance({ method: 'POST', url: 'user/test/create-test-package' })
    })

    after(async () => {
        await axiosTestInstance({ method: 'POST', url: 'user/test/remove-test-learner' })
        await axiosTestInstance({ method: 'POST', url: 'user/test/remove-test-package' })
    })


    it('Before All', () => {
        console.log('Before all')
    })
})