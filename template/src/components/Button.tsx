import { ButtonHTMLAttributes } from "react";

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { children, ...rest } = props;
  return <button {...rest}>{children}</button>;
};

export default Button;
