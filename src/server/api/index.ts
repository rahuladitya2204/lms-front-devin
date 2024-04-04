export interface PublicAuthProps {
  userType: string;
  orgAlias: string;
}

export interface AuthProps extends PublicAuthProps {
  token: string;
}

const getPublicRequestHeaders = (props: PublicAuthProps) => {
  return {
    "x-org-alias": props.orgAlias,
    "x-user-type": props.userType,
  };
};

const getAuthRequestHeaders = (props: AuthProps) => {
  return {
    ...getPublicRequestHeaders(props),
    "x-auth": props.token,
  };
};

export const validateOrgAlias = async ({ alias }: { alias: string }) => {
  console.log("API_URL", process.env.NEXT_PUBILC_API_URL, process.env.API_URL);
  return fetch(
    process.env.API_URL + "/learner/organisation/alias/validate",
    {
      method: "POST",
      body: JSON.stringify({ alias: alias }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const validateUser = async (props: AuthProps) => {
  console.log(props, "here validating user");
  return fetch(
    process.env.NEXT_PUBLIC_API_URL + `/${props.userType}/validate`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        ...getAuthRequestHeaders(props),
      },
    }
  );
};
