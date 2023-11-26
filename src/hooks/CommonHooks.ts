import { Common, Constants, Learner, Store, Types, Utils } from '@adewaskar/lms-common'
import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import { generatePushToken } from 'push-notification/config';
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

export const useAppInit = () => {
  const isValidAlias = Store.useGlobal(s => s.isAliasValid);
  const { data: organisation,isLoading: loadingOrganisation } = Common.Queries.useGetOrgDetails();
  const { mutate: validateOrgAlias,isLoading: validatingOrgAlias } = Common.Queries.useValidateOrgAlias();
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
      alias: sd
    });
    generatePushToken();
  }, [])

  return { isInitDone: (isValidAlias&&!loadingOrganisation) }
}


export const usePaymentCheckout = () => {
  const { data: organisation } = Learner.Queries.useGetOrgDetails()
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