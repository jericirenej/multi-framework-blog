import style from "@/styles/components/Atoms/box";
import type { FC, PropsWithChildren } from "react";

export type Props = Required<PropsWithChildren>;
const Box: FC<Props> = ({ children }) => {
  console.log(children);
  return <div className={style}>{children}</div>;
};

export default Box;
