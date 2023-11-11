import React, { Fragment, useEffect, useState } from 'react'

import { Drawer } from 'antd'

interface ActionDrawerPropsI {
  children?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  title?: string | React.ReactNode;
  width?: number | string;
  keyboardClosable?: boolean;
  height?: number | string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  visible?: boolean;
  extra?: React.ReactNode[];
  cta?: React.ReactNode;
  footer?: (f: any) => React.ReactNode[];
}

function ActionDrawer(props: ActionDrawerPropsI) {
  const [isVisible, setIsVisible] = useState(false)

  const showDrawer = () => {
    setIsVisible(true)
  }

  useEffect(
    () => {
      setIsVisible(!!props.visible)
    },
    [props.visible]
  )

  const closeDrawer = () => {
    setIsVisible(false)
    props.onClose && props.onClose()
  }

  // Extend children with closeDrawer method
  const childrenWithCloseDrawer = React.Children.map(
    props.children,
    child =>
      React.isValidElement(child)
        ? // @ts-ignore
          React.cloneElement(child, { closeDrawer })
        : child
  )

  return (
    <Fragment>
      <div onClick={showDrawer}>{props.cta}</div>
      <Drawer
        style={{ padding: 10 }}
        keyboard={props.keyboardClosable} extra={props.extra}
        closable={props.closable}
        width={props.width}
        height={props.height}
        placement={props.placement}
        onClose={closeDrawer}
        visible={isVisible}
        title={props.title}
        footer={props.footer ? props.footer(closeDrawer) : null}
      >
        {isVisible && childrenWithCloseDrawer}
      </Drawer>
    </Fragment>
  )
}

export default ActionDrawer

export interface ActionDrawerI {
  closeDrawer?: () => void;
}
