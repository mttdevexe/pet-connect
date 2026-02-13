"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./style.module.css";
import InputFieldComponent from "../../../components/InputFieldComponent/InputFieldComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import {
  getPet,
  updatePet,
  type PetType,
  type PetSize,
  type PetResponse,
} from "../../../actions/pet";

const PET_TYPE_LABELS: Record<PetType, string> = {
  PET: "Pet",
  REPTILE: "Reptil",
  RODENT: "Roedor",
  BIRD: "Ave",
  FISH: "Peixe",
  WILD_ANIMAL: "Animal Silvestre",
};

const PET_SIZE_LABELS: Record<PetSize, string> = {
  SMALL: "Pequeno",
  MEDIUM: "Medio",
  LARGE: "Grande",
};

export default function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [pet, setPet] = useState<PetResponse | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    pet_type: "PET" as PetType,
    gender: "",
    size: "MEDIUM" as PetSize,
    color: "",
    breed: "",
    age: "",
    description_history: "",
    vaccination_history: "",
    status: "available",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const data = await getPet(id);
        setPet(data);
        setFormData({
          name: data.name,
          pet_type: data.pet_type,
          gender: data.gender,
          size: data.size,
          color: data.color,
          breed: data.breed || "",
          age: data.age || "",
          description_history: data.description_history || "",
          vaccination_history: data.vaccination_history || "",
          status: data.status,
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao carregar dados do pet.");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updatePet(id, {
        pet_type: formData.pet_type,
        name: formData.name,
        age: formData.age || undefined,
        gender: formData.gender,
        size: formData.size,
        description_history: formData.description_history || undefined,
        breed: formData.breed || undefined,
        color: formData.color,
        status: formData.status,
        vaccination_history: formData.vaccination_history || undefined,
      });

      setSuccess("Pet atualizado com sucesso!");
      setTimeout(() => {
        router.push("/pets");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao atualizar pet.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <p className={styles.loadingText}>Carregando dados do pet...</p>
        </div>
      </div>
    );
  }

  if (!pet && error) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.errorMessage}>{error}</div>
          <div className={styles.footer}>
            <Link href="/pets" className={styles.footerLink}>
              Voltar para meus pets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <span className={styles.logoIcon}>🐾</span>
            <h1 className={styles.logoTitle}>Pet Connect</h1>
          </div>
          <p className={styles.subtitle}>Editar dados do pet</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>✏️</span>
            <h2 className={styles.cardTitle}>Editar {pet?.name}</h2>
          </div>
          <p className={styles.cardDescription}>
            Atualize as informacoes do pet
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label className={styles.label}>Tipo de Animal</label>
              <div className={styles.typeButtonsContainer}>
                {(Object.keys(PET_TYPE_LABELS) as PetType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, pet_type: type }))
                    }
                    className={
                      formData.pet_type === type
                        ? styles.typeButtonActive
                        : styles.typeButton
                    }
                  >
                    {PET_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Dados do Pet</h3>
              <div className={styles.grid}>
                <div className={styles.fullWidth}>
                  <InputFieldComponent
                    label="Nome *"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nome do pet"
                    required
                  />
                </div>

                <InputFieldComponent
                  label="Cor *"
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ex: Caramelo"
                  required
                />

                <InputFieldComponent
                  label="Raca"
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="Ex: Labrador"
                />

                <InputFieldComponent
                  label="Idade"
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ex: 2 anos"
                />

                <div>
                  <label className={styles.label}>Genero *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Macho">Macho</option>
                    <option value="Femea">Femea</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className={styles.label}>Porte</label>
              <div className={styles.typeButtonsContainer}>
                {(Object.keys(PET_SIZE_LABELS) as PetSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, size }))
                    }
                    className={
                      formData.size === size
                        ? styles.typeButtonActive
                        : styles.typeButton
                    }
                  >
                    {PET_SIZE_LABELS[size]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Informacoes Adicionais</h3>
              <div className={styles.grid}>
                <div className={styles.fullWidth}>
                  <label className={styles.label}>Historico / Descricao</label>
                  <textarea
                    name="description_history"
                    value={formData.description_history}
                    onChange={handleChange}
                    placeholder="Conte um pouco sobre o pet..."
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.fullWidth}>
                  <label className={styles.label}>
                    Historico de Vacinacao
                  </label>
                  <textarea
                    name="vaccination_history"
                    value={formData.vaccination_history}
                    onChange={handleChange}
                    placeholder="Vacinas que o pet ja tomou..."
                    className={styles.textarea}
                  />
                </div>

                <div>
                  <label className={styles.label}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="available">Disponivel</option>
                    <option value="adopted">Adotado</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>
              </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && (
              <div className={styles.successMessage}>{success}</div>
            )}

            <ButtonComponent type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alteracoes"}
            </ButtonComponent>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              <Link href="/pets" className={styles.footerLink}>
                Voltar para meus pets
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
