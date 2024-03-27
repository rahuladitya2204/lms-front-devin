const getIsServer = (): boolean => {
  return typeof window === "undefined";
};

export default getIsServer;
