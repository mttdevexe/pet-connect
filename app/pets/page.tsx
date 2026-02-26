"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./style.module.css";
import { listMyPets, deletePet, type PetResponse } from "../actions/pet";

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

export default function PetsPage() {
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await listMyPets();
      setPets(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar pets.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return;

    try {
      await deletePet(id);
      setPets((prev) => prev.filter((pet) => pet.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao excluir pet.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Link href="/" className={styles.logoContainer}>
            <span className={styles.logoIcon}>🐾</span>
            <h1 className={styles.logoTitle}>Pet Connect</h1>
          </Link>
          <p className={styles.subtitle}>Gerencie seus pets</p>
        </div>

        <div className={styles.topBar}>
          <span className={styles.topBarTitle}>Meus Pets</span>
          <Link href="/pets/new" className={styles.addButton}>
            + Novo Pet
          </Link>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {loading ? (
          <p className={styles.loadingText}>Carregando seus pets...</p>
        ) : pets.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🐶</div>
            <h3 className={styles.emptyTitle}>Nenhum pet cadastrado</h3>
            <p className={styles.emptyDescription}>
              Cadastre seu primeiro pet para comecar!
            </p>
            <Link href="/pets/new" className={styles.addButton}>
              + Cadastrar Pet
            </Link>
          </div>
        ) : (
          <div className={styles.petGrid}>
            {pets.map((pet) => (
              <div key={pet.id} className={styles.petCard}>
                <div className={styles.petCardImageContainer}>
                  {pet.pictures_url && pet.pictures_url.length > 0 ? (
                    <img
                      src={pet.pictures_url[0]}
                      alt={pet.name}
                      className={styles.petCardImage}
                    />
                  ) : (
                    <div className={styles.petCardImagePlaceholder}>
                      {PET_TYPE_EMOJI[pet.pet_type] || "🐾"}
                    </div>
                  )}
                </div>
                <div className={styles.petCardBody}>
                  <div className={styles.petCardHeader}>
                    <span className={styles.petName}>{pet.name}</span>
                    <span
                      className={`${styles.petStatus} ${getStatusClass(pet.status)}`}
                    >
                      {STATUS_LABELS[pet.status] || pet.status}
                    </span>
                  </div>
                  <div className={styles.petInfo}>
                    <div className={styles.petInfoRow}>
                      <span className={styles.petInfoLabel}>Tipo</span>
                      <span className={styles.petInfoValue}>
                        {PET_TYPE_LABELS[pet.pet_type] || pet.pet_type}
                      </span>
                    </div>
                    <div className={styles.petInfoRow}>
                      <span className={styles.petInfoLabel}>Porte</span>
                      <span className={styles.petInfoValue}>
                        {PET_SIZE_LABELS[pet.size] || pet.size}
                      </span>
                    </div>
                    <div className={styles.petInfoRow}>
                      <span className={styles.petInfoLabel}>Genero</span>
                      <span className={styles.petInfoValue}>{pet.gender}</span>
                    </div>
                    <div className={styles.petInfoRow}>
                      <span className={styles.petInfoLabel}>Cor</span>
                      <span className={styles.petInfoValue}>{pet.color}</span>
                    </div>
                    {pet.breed && (
                      <div className={styles.petInfoRow}>
                        <span className={styles.petInfoLabel}>Raca</span>
                        <span className={styles.petInfoValue}>{pet.breed}</span>
                      </div>
                    )}
                    {pet.age && (
                      <div className={styles.petInfoRow}>
                        <span className={styles.petInfoLabel}>Idade</span>
                        <span className={styles.petInfoValue}>{pet.age}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.petActions}>
                    <Link
                      href={`/pets/${pet.id}/edit`}
                      className={styles.editButton}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(pet.id, pet.name)}
                      className={styles.deleteButton}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
