import { ReactNode } from "react";
import classNames from "classnames";

type Props = {
  children?: ReactNode;
  noBorder?: boolean;
};

export const VuiMenu = ({ children, noBorder }: Props) => {
  const classes = classNames("vuiMenu", { "vuiMenu--noBorder": noBorder });
  return <div className={classes}>{children}</div>;
};
