"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./style.module.css";
import InputFieldComponent from "../components/InputFieldComponent/InputFieldComponent";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import { login } from "../actions/login";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      router.push("/home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao fazer login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <span className={styles.logoIcon}>🐾</span>
            <h1 className={styles.logoTitle}>Pet Connect</h1>
          </div>
          <p className={styles.subtitle}>Conectando pets a novos lares</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>❤️</span>
            <h2 className={styles.cardTitle}>Entrar</h2>
          </div>
          <p className={styles.cardDescription}>
            Acesse sua conta para gerenciar seus pets
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <InputFieldComponent
              label="E-mail *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            <InputFieldComponent
              label="Senha *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />

            {error && <div className={styles.errorMessage}>{error}</div>}

            <ButtonComponent type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </ButtonComponent>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Ainda não tem uma conta?{" "}
              <Link href="/register" className={styles.footerLink}>
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
