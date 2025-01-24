import React from "react";
import { createBEM } from "@lacorda/bem";
import Aside from "./aside";
import Header from "./header";

const bem = createBEM("mern-container");

const Container = (props) => {
  const { className, children } = props;

  const cls = bem([className, 'flex', 'min-h-screen']);

  return (
    <div className={cls}>
      <div className={bem("left", ['mr-4'])}>
        <Aside />
      </div>
      <div className={bem("right", ['flex-1'])}>
        <Header />
        <div className={bem("content")}>{children}</div>
      </div>
    </div>
  );
};

export default Container;
