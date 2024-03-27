export const validateOrgAlias = async ({ alias }: { alias: string }) => {
  return fetch(
    process.env.NEXT_PUBLIC_API_URL + "/learner/organisation/alias/validate",
    {
      method: "POST",
      body: JSON.stringify({ alias: alias }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
