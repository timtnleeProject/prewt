import { ButtonHTMLAttributes, useMemo } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  op?: number;
}
const Button = (props: ButtonProps) => {
  const { children, op, ...rest } = props;
  // TODO: check this should have lint error
  const num = useMemo(() => (op ? 0 : (op as number) + 2), []);
  return (
    <button {...rest}>
      {children} {num}
    </button>
  );
};

export default Button;
