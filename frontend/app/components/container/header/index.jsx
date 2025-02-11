'use client';

import React, { useState } from "react";
import { createBEM } from "@lacorda/bem";
import { Button } from "antd";
import LoginModal from '../../loginModal';
import '@ant-design/v5-patch-for-react-19';

const bem = createBEM("mern-header");

const Header = (props) => {
  const { className } = props;

  const [showLoginModal, setShowLoginModal] = useState(false);

  const cls = bem([className, 'flex']);

  const handleLogin = () => {
    setShowLoginModal(true);
  }

  return (
    <div className={cls}>
      <div className={bem([{ left: true }, 'flex-1'])}></div>
      <div className={bem([{ right: true }, 'm-1'])}>
        <Button type="primary" onClick={handleLogin}>登录</Button>
      </div>

      <LoginModal visible={showLoginModal} onClose={() => { setShowLoginModal(false) }} />
    </div>
  );
};

export default Header;
