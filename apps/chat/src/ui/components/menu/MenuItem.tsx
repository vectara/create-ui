import classNames from "classnames";
import { VuiSpacer } from "../spacer/Spacer";
import { Props as LinkProps } from "../link/Link";
import { Link } from "react-router-dom";

export type MenuItem = {
  className?: string;
  title?: React.ReactNode;
  text?: React.ReactNode;
  onClick?: () => void;
  href?: LinkProps["href"];
  color?: "neutral" | "primary" | "danger";
};

export const VuiMenuItem = ({ className, title, text, onClick, href, color = "neutral", ...rest }: MenuItem) => {
  const classes = classNames(className, "vuiMenuItem", `vuiMenuItem--${color}`);

  const props = {
    className: classes,
    onClick,
    ...rest
  };

  const content = (
    <>
      {title && <div className="vuiMenuItem__title">{title}</div>}
      {text && title && <VuiSpacer size="xxs" />}
      {text && <div className="vuiMenuItem__text">{text}</div>}
    </>
  );

  if (href)
    return (
      <Link to={href} {...props}>
        {content}
      </Link>
    );

  return <button {...props}>{content}</button>;
};
