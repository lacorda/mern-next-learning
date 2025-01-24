'use client';

import React from "react";
import { createBEM } from "@lacorda/bem";
import { Button } from "antd";
import '@ant-design/v5-patch-for-react-19';

const bem = createBEM("mern-header");

const Header = (props) => {
  const { className } = props;

  const cls = bem([className, 'flex']);

  const handleLogin = () => {
    console.log('🍄  handleLogin');
  }

  return (
    <div className={cls}>
      <div className={bem([{ left: true }, 'flex-1'])}></div>
      <div className={bem([{ right: true }, 'm-1'])}>
        <Button type="primary" onClick={handleLogin}>登录</Button>
      </div>
    </div>
  );
};

export default Header;
