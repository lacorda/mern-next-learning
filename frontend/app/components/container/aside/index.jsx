import { createBEM } from "@lacorda/bem";
import Menu from "../menu";

const bem = createBEM("mern-aside");

const Aside = (props) => {
  const { className, style } = props;

  const cls = bem([className, 'min-h-screen', 'border-r', 'border-gray-300', 'flex', 'flex-col']);

  return (
    <div className={cls} style={style}>
      <Menu />
      <div className="flex-1 text-center border-t">底部内容</div>
    </div>
  );
};

export default Aside;
