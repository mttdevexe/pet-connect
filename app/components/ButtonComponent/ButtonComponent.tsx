import styles from "./style.module.css";

interface ButtonComponentProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function ButtonComponent({
  children,
  type = "button",
  disabled = false,
  variant = "primary",
  onClick,
}: ButtonComponentProps) {
  const buttonClass =
    variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={buttonClass}
    >
      {children}
    </button>
  );
}
