"use client";

import { Card, Col, Row } from "@Lib/index";
import { Learner, Store } from "@adewaskar/lms-common";

import Header from "@Components/Header";
import Layout from "@Components/Layout";
import LearnerLogin from "@Learner/Screens/Login";
import { ModalProvider } from "@Components/ActionModal/ModalContext";
import { Outlet, useOutletContext } from "react-router";
import React from "react";
import ThemeProvider from "./ThemeProvider";
import { useBlockBackButton } from "@User/Screens/Event/LiveSessionPlayer/User/hooks";
import useDehydration from "@ServerHooks/useDehydration";

interface LearnerFullPageHolderPropsI {
  children?: React.ReactNode;
  isServer?: boolean;
  noSignIn?: boolean;
}

export default function LearnerFullPageHolder(
  props: LearnerFullPageHolderPropsI
) {
  // useBlockBackButton();
  useDehydration();
  const outletcontext = useOutletContext<any>();
  const isSignedIn = Store.useAuthentication((s) => s.isSignedIn);
  let Comp: React.ReactNode;
  if (props.noSignIn) {
    Comp = props.children || <Outlet />;
  } else {
    Comp = isSignedIn ? (
      props.children ? (
        props.children
      ) : (
        <Outlet />
      )
    ) : (
      <Row justify={"center"} align={"middle"}>
        <Col>
          <Card style={{ marginTop: 120, width: 300 }}>
            <LearnerLogin />
          </Card>
        </Col>
      </Row>
    );
  }
  return (
    <ThemeProvider showLoadingScreen={outletcontext?.showLoadingScreen}>
      <ModalProvider>
        <Layout
          style={{ minHeight: "100vh", paddingLeft: 10, paddingRight: 10 }}
        >
          {Comp}
        </Layout>
      </ModalProvider>
    </ThemeProvider>
  );
}
