"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./style.module.css";
import InputFieldComponent from "../components/InputFieldComponent/InputFieldComponent";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import {
  registerResponsible,
  type ResponsibleType,
} from "../actions/registerResponsible";
import { applyMask } from "../helpers/formatters";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    cnpj: "",
    type: "INDIVIDUAL" as ResponsibleType,
    phone_number: "",
    address: "",
    postal_code: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const formattedValue = applyMask(name, value);
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleTypeChange = (type: ResponsibleType) => {
    setFormData((prev) => ({ ...prev, type, cnpj: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (formData.cpf.length < 11) {
      setError("CPF deve ter pelo menos 11 caracteres.");
      return;
    }

    if (
      formData.type === "ORGANIZATION" &&
      (!formData.cnpj || formData.cnpj.length < 14)
    ) {
      setError("CNPJ deve ter pelo menos 14 caracteres para organizações.");
      return;
    }

    setLoading(true);

    try {
      await registerResponsible({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        cnpj: formData.cnpj,
        type: formData.type,
        phone_number: formData.phone_number,
        address: formData.address,
        postal_code: formData.postal_code,
      });

      setSuccess("Conta criada com sucesso! Você já pode fazer login.");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        cpf: "",
        cnpj: "",
        type: "INDIVIDUAL",
        phone_number: "",
        address: "",
        postal_code: "",
      });
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 3000);

      return () => clearTimeout(timeout);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao criar conta.");
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
            <h2 className={styles.cardTitle}>Cadastro de Responsável</h2>
          </div>
          <p className={styles.cardDescription}>
            Preencha os dados abaixo para criar sua conta
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label className={styles.label}>Tipo de Conta</label>
              <div className={styles.typeButtonsContainer}>
                <button
                  type="button"
                  onClick={() => handleTypeChange("INDIVIDUAL")}
                  className={
                    formData.type === "INDIVIDUAL"
                      ? styles.typeButtonActive
                      : styles.typeButton
                  }
                >
                  Pessoa Física
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("ORGANIZATION")}
                  className={
                    formData.type === "ORGANIZATION"
                      ? styles.typeButtonActive
                      : styles.typeButton
                  }
                >
                  Organização
                </button>
              </div>
            </div>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
              <div className={styles.grid}>
                <div className={styles.fullWidth}>
                  <InputFieldComponent
                    label="Nome Completo *"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: João da Silva"
                    required
                  />
                </div>

                <InputFieldComponent
                  label="CPF *"
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />

                {formData.type === "ORGANIZATION" && (
                  <InputFieldComponent
                    label="CNPJ *"
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                )}

                <InputFieldComponent
                  label="Telefone"
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Endereço (Opcional)</h3>
              <div className={styles.grid}>
                <div className={styles.fullWidth}>
                  <InputFieldComponent
                    label="Endereço"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>

                <InputFieldComponent
                  label="CEP"
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="00000-000"
                />
              </div>
            </div>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Dados de Acesso</h3>
              <div className={styles.grid}>
                <div className={styles.fullWidth}>
                  <InputFieldComponent
                    label="E-mail *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <InputFieldComponent
                  label="Senha *"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />

                <InputFieldComponent
                  label="Confirmar Senha *"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita a senha"
                  required
                />
              </div>
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}

            {success && <div className={styles.successMessage}>{success}</div>}
            <ButtonComponent type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </ButtonComponent>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Já tem uma conta?{" "}
              <Link href="/login" className={styles.footerLink}>
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
