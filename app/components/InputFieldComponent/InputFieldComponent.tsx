import styles from "./style.module.css";

interface InputFieldComponentProps {
  label: string;
  type?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export default function InputFieldComponent({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}: InputFieldComponentProps) {
  return (
    <div>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={styles.input}
      />
    </div>
  );
}
