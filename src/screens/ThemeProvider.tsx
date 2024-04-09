"use client";
import { Common, Constants, Enum, Store } from "@adewaskar/lms-common";
import { ConfigProvider, Spin, message, theme } from "@Lib/index";
import useMessage, { MessageContext } from "@Hooks/useMessage";

import ApplyFavicon from "@Learner/Screens/LearnerRoot/ApplyFavicon";
import Banner from "@Components/Banner";
import LoadingScreen from "@Components/LoadingScreen";
import { ModalProvider } from "@Components/ActionModal/ModalContext";
import useDynamicFont from "@Hooks/useDynamicFont";
import { useMemo } from "react";

const { darkAlgorithm } = theme;
function ThemeProvider(props: any) {
  const { data: organisation, isLoading: loadingOrgDetails } =
    Common.Queries.useGetOrgDetails();
  // @ts-ignore
  const { branding, shortName } =
    organisation || Constants.INITIAL_ORG_SETTING_DETAILS.branding;
  // console.log(branding, 'branding')
  // const { isLoading } = useDynamicFont({
  //   fontName: branding?.font?.name,
  //   fontUrl: branding?.font?.url
  // })
  const algorithm = useMemo(() => {
    const themes = [];
    if (branding.theme === Enum.THEMES.DARK) {
      themes.push(darkAlgorithm);
    }
    return themes;
  }, [branding?.theme]);

  // if (isLoading || props.showLoadingScreen) {
  //   return <LoadingScreen />
  // }
  // console.log(organisation._id, 'bbrr')
  const showLoader = !organisation._id;
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: algorithm,
          token: {
            colorPrimary: branding?.colors?.primary || "blue",
            fontFamily: branding?.font?.name || "Jost",
            // algorithm: true
          },
        }}
        csp={{ nonce: "YourNonceCode" }}
      >
        <ModalProvider>
          {showLoader ? (
            <div style={{ position: "fixed", left: "50%", top: "50%" }}>
              <Spin tip="Loading.." />
            </div>
          ) : (
            props.children
          )}
        </ModalProvider>
      </ConfigProvider>
      <ApplyFavicon shortName={shortName} faviconUrl={branding.favIcon.url} />
    </>
  );
}

export default ThemeProvider;
