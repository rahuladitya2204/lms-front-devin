import { Common, Constants, Learner, Store, Types, Utils } from '@adewaskar/lms-common'
import { createSearchParams, useOutletContext } from 'react-router-dom'
import { useNavigate, useParams } from '@Router/next';
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

/**
 * Custom hook to determine if a component is currently mounted.
 *
 * @description
 * The `useIsMounted` hook keeps track of the component's mounted state. 
 * It returns a boolean value indicating whether the component is currently mounted or not.
 *
 * When the component mounts, the `useEffect` hook sets the `isMounted` state to `true`.
 * When the component unmounts, the cleanup function sets the `isMounted` state to `false`.
 *
 * This hook is useful for conditionally executing code that depends on the component
 * being mounted, such as accessing browser-specific APIs or performing DOM manipulations.
 */
const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
};

// SSR safe by using useIsMounted
export const useAppInit = () => {
  const isMounted = useIsMounted();
  const isValidAlias = Store.useGlobal(s => s.isAliasValid);
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn);
  usePushNotification(isSignedIn);
  const { data: organisation, isLoading: loadingOrganisation } = Common.Queries.useGetOrgDetails();
  const { mutate: validateOrgAlias, isLoading: validatingOrgAlias } = Common.Queries.useValidateOrgAlias();
  const { mutate: validateAffiliateId } = Common.Queries.useValidateAffiliateId();

  const [subdomain, setSubdomain] = useState('');
  const [affiliateId, setAffiliateId] = useState('');

  useEffect(() => {
    if (isMounted) {
      const queryString = window.location.search;
      const queryParams = new URLSearchParams(queryString);
      const affiliateId = queryParams.get('ref') || '';
      const parts = window.location.hostname.split('.');
      const subdomain = parts.slice(0, -2).join('-');

      setSubdomain(subdomain);
      setAffiliateId(affiliateId);
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted && subdomain) {
      validateOrgAlias({ alias: subdomain ?? '' });
    }
  }, [isMounted, subdomain, validateOrgAlias]);

  useEffect(() => {
    if (isMounted && affiliateId && isValidAlias) {
      validateAffiliateId({ affiliateId });
    }
  }, [isMounted, affiliateId, isValidAlias, validateAffiliateId]);

  return {
    isInitDone: isValidAlias && !loadingOrganisation,
  };
};

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
      // key: organisation.paymentGateway.key,
      key:'rzp_test_DSNLOopXvG9RMT',
      image: organisation.logo,
      amount: pgOrder.amount,
      handler:cb
    });
    console.log(rzpay,'rzpay')
    return rzpay.open();
  }

  return { openCheckout };
}