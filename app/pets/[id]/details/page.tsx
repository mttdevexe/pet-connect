"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import styles from "./style.module.css";
import { getPet, type PetResponse } from "../../../actions/pet";

const PET_TYPE_LABELS: Record<string, string> = {
  PET: "Pet",
  REPTILE: "Reptil",
  RODENT: "Roedor",
  BIRD: "Ave",
  FISH: "Peixe",
  WILD_ANIMAL: "Animal Silvestre",
};

const PET_TYPE_EMOJI: Record<string, string> = {
  PET: "🐶",
  REPTILE: "🦎",
  RODENT: "🐹",
  BIRD: "🐦",
  FISH: "🐠",
  WILD_ANIMAL: "🦁",
};

const PET_SIZE_LABELS: Record<string, string> = {
  SMALL: "Pequeno",
  MEDIUM: "Medio",
  LARGE: "Grande",
};

const STATUS_LABELS: Record<string, string> = {
  available: "Disponivel",
  adopted: "Adotado",
  pending: "Pendente",
};

function getStatusClass(status: string) {
  switch (status) {
    case "available":
      return styles.statusAvailable;
    case "adopted":
      return styles.statusAdopted;
    case "pending":
      return styles.statusPending;
    default:
      return styles.statusAvailable;
  }
}

export default function PetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [pet, setPet] = useState<PetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const data = await getPet(id);
        setPet(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao carregar dados do pet.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <p className={styles.loadingText}>Carregando detalhes do pet...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.errorMessage}>
            {error || "Pet nao encontrado."}
          </div>
          <Link href="/" className={styles.backLink}>
            Voltar para a pagina inicial
          </Link>
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
          <p className={styles.subtitle}>Detalhes do pet</p>
        </div>

        <div className={styles.card}>
          <div className={styles.imageContainer}>
            {pet.pictures_url && pet.pictures_url.length > 0 ? (
              <img
                src={pet.pictures_url[0]}
                alt={pet.name}
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                {PET_TYPE_EMOJI[pet.pet_type] || "🐾"}
              </div>
            )}
            <span
              className={`${styles.statusBadge} ${getStatusClass(pet.status)}`}
            >
              {STATUS_LABELS[pet.status] || pet.status}
            </span>
          </div>

          <div className={styles.cardBody}>
            <h2 className={styles.petName}>{pet.name}</h2>
            <p className={styles.petType}>
              {PET_TYPE_LABELS[pet.pet_type] || pet.pet_type}
              {pet.breed ? ` - ${pet.breed}` : ""}
            </p>

            <div className={styles.infoGrid}>
              {pet.age && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Idade</div>
                  <div className={styles.infoValue}>{pet.age}</div>
                </div>
              )}
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Genero</div>
                <div className={styles.infoValue}>{pet.gender}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Porte</div>
                <div className={styles.infoValue}>
                  {PET_SIZE_LABELS[pet.size] || pet.size}
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Cor</div>
                <div className={styles.infoValue}>{pet.color}</div>
              </div>
              {pet.breed && (
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Raca</div>
                  <div className={styles.infoValue}>{pet.breed}</div>
                </div>
              )}
            </div>

            {pet.description_history && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📝 Sobre</h3>
                <div className={styles.sectionContent}>
                  {pet.description_history}
                </div>
              </div>
            )}

            {pet.vaccination_history && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>💉 Vacinacao</h3>
                <div className={styles.sectionContent}>
                  {pet.vaccination_history}
                </div>
              </div>
            )}
          </div>
        </div>

        <Link href="/" className={styles.backLink}>
          Voltar para a pagina inicial
        </Link>
      </div>
    </div>
  );
}
