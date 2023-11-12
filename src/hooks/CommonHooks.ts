import { Common, Constants, Learner, Store, Types, Utils } from '@adewaskar/lms-common'
import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import { getToken } from '@Network/index'
import useRazorpay from "react-razorpay";

export const useNavigateParams = () => {
  const navigate = useNavigate()

  return (url: string, params: Record<string, string | string[]>) => {
    const searchParams = createSearchParams(params).toString()
    navigate(url + '?' + searchParams)
  }
}

export const useGetNodeFromRouterOutlet = () => {
  const { itemId,sectionId } = useParams();
  const [items, courseId] = useOutletContext<Types.CourseSection[][]>();
  // console.log(items,itemId, 'nodeee');
  return {  courseId,sectionId };
}

export const useAppInit = (type: string) => {
  const token = getToken();
  const [isAliasValid, setAliasValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false);
  const {
    mutate: validateUser,
  } = Common.Queries.useValidateUser();
  const { mutate: validateOrgAlias } = Common.Queries.useValidateOrgAlias();
  const enabled = !!isAliasValid;

  let subdomain = useMemo(
    () => {
      const hostname = window.location.hostname
      const parts = hostname.split('.')
      const subdomain = parts.length > 2 ? parts[0] : null
      return subdomain
    },
    [window.location.hostname]
  )
  useEffect(() => {
    const sd = subdomain + '';
    validateOrgAlias({
      alias:sd
    }, {
      onSuccess: () => {
        console.log('Org Alias', sd, 'Has been validated')
        setAliasValid(true)
      }
    })
  }, [])
  // useEffect(() => {
  //   if (isSignedIn && type === 'user' &&enabled) {
  //     fetchOrganisation(`user`)
  //   }
  //  },[enabled])

  useEffect(() => {
    if (enabled) {
      initApp(type);
    }
  }, [type, token, enabled]);

  const initApp = async (userType: string) => {
    const { setIsSignedin, isSignedIn } = Store.useAuthentication.getState();

    try {
      setLoading(true);
      // if (isSignedIn && userType === 'user') {
      //   await fetchOrganisation(`user`);
      // }
      // if (userType === 'learner') {
      //   await fetchOrganisation(`learner`);
      // }
      if (token) {
        await validateUser({
          type: type,
          // onSuccess: (d) => {
          //   setUser(d.user)
          //   console.log('Signed In')
          //   setIsSignedin(true)
          //  }
        }, {
          onSuccess: (d) => {
            console.log(d, 'dd')
            // @ts-ignore
            setUser(d.user, userType);
            console.log('Signed In')
            setIsSignedin(true)
           }
        });
      }
    }
    catch (er) {
      setLoading(false)
    }
  }


  return { isInitDone: loading,isAliasValid }
}


export const usePaymentCheckout = () => {
  const { data: organisation } = Common.Queries.useGetOrgDetails()
  const Razorpay = useRazorpay();
  // @ts-ignore
  const openCheckout = ({pgOrder,order},cb) => {
    const rzpay = new Razorpay({
      order_id: pgOrder.id,
      callback_url:`${Constants.config.API_URL}/learner/${order._id}/successful`,
      currency: pgOrder.currency,
      name: organisation.name,
      // @ts-ignore
      key: organisation.paymentGateway.key,
      image: organisation.logo,
      amount: pgOrder.amount,
      handler:cb
    });
    console.log(rzpay,'rzpay')
    return rzpay.open();
  }

  return { openCheckout };
}