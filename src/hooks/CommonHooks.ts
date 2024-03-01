import { Common, Constants, Learner, Store, Types, Utils } from '@adewaskar/lms-common'
import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import { usePushNotification } from 'push-notification/usePushNotification';
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
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn);
  usePushNotification(isSignedIn);
  const { data: organisation,isLoading: loadingOrganisation } = Common.Queries.useGetOrgDetails();
  const { mutate: validateOrgAlias,isLoading: validatingOrgAlias } = Common.Queries.useValidateOrgAlias();
  const { mutate: validateAffiliateId } = Common.Queries.useValidateAffiliateId();
  let { subdomain, affiliateId } = useMemo(
    () => {
      const queryString = window.location.search;
      const queryParams = new URLSearchParams(queryString);
      const affiliateId = queryParams.get('ref'); // Replace 'myParam' with your parameter name
      const parts = window.location.hostname.split('.');
      // Assuming the format is always [subdomain].[domain].[tld]
      const subdomain = parts.slice(0, -2).join('-');
      // console.log(subdomain,'ddss')
      return {
        affiliateId,subdomain
      }
    },
    [window.location]
  )
  useEffect(() => {// uncomment this later
    const sd = subdomain + '';
    // console.log(sd, 'ssss');
    // const sd = `www`
    validateOrgAlias({
      alias: sd,
    });
  }, [])

  useEffect(() => {
    if (affiliateId && isValidAlias) {
      validateAffiliateId({ affiliateId });
      }
  },[affiliateId,isValidAlias])

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