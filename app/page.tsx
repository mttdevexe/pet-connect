"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import { listAllPets, type PetResponse } from "./actions/pet";

const PET_TYPE_EMOJI: Record<string, string> = {
  PET: "🐶",
  REPTILE: "🦎",
  RODENT: "🐹",
  BIRD: "🐦",
  FISH: "🐠",
  WILD_ANIMAL: "🦁",
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

export default function HomePage() {
  const router = useRouter();
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    setIsLoggedIn(!!token);

    const fetchPets = async () => {
      try {
        const data = await listAllPets();
        setPets(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handlePetClick = (petId: string) => {
    if (isLoggedIn) {
      router.push(`/pets/${petId}/details`);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logoContainer}>
            <span className={styles.logoIcon}>🐾</span>
            <span className={styles.logoTitle}>Pet Connect</span>
          </div>
          <div className={styles.navActions}>
            {isLoggedIn ? (
              <>
                <Link href="/pets" className={styles.navLink}>
                  Meus Pets
                </Link>
                <Link href="/home" className={styles.navLink}>
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.navLink}>
                  Entrar
                </Link>
                <Link href="/register" className={styles.navButtonPrimary}>
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Encontre seu novo melhor amigo</h1>
        <p className={styles.heroSubtitle}>
          Conectamos pets que precisam de um lar a pessoas que querem fazer a
          diferenca. Adote com amor!
        </p>
      </section>

      {/* Content */}
      <main className={styles.content}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Pets para adocao</h2>
          {!loading && (
            <span className={styles.petCount}>
              {pets.length} {pets.length === 1 ? "pet" : "pets"}
            </span>
          )}
        </div>

        {loading ? (
          <p className={styles.loadingText}>Carregando pets...</p>
        ) : pets.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🐾</div>
            <h3 className={styles.emptyTitle}>Nenhum pet cadastrado ainda</h3>
            <p className={styles.emptyDescription}>
              Em breve novos pets estarao disponiveis para adocao!
            </p>
          </div>
        ) : (
          <div className={styles.petGrid}>
            {pets.map((pet) => (
              <div
                key={pet.id}
                className={styles.petCard}
                onClick={() => handlePetClick(pet.id)}
              >
                <div className={styles.petImageContainer}>
                  {pet.pictures_url && pet.pictures_url.length > 0 ? (
                    <img
                      src={pet.pictures_url[0]}
                      alt={pet.name}
                      className={styles.petImage}
                    />
                  ) : (
                    <div className={styles.petImagePlaceholder}>
                      {PET_TYPE_EMOJI[pet.pet_type] || "🐾"}
                    </div>
                  )}
                  <span
                    className={`${styles.petStatusBadge} ${getStatusClass(pet.status)}`}
                  >
                    {STATUS_LABELS[pet.status] || pet.status}
                  </span>
                </div>
                <div className={styles.petCardBody}>
                  <h3 className={styles.petName}>{pet.name}</h3>
                  <div className={styles.petDetails}>
                    {pet.age && (
                      <span className={styles.petDetail}>
                        <span className={styles.petDetailIcon}>📅</span>
                        {pet.age}
                      </span>
                    )}
                    <span className={styles.petDetail}>
                      <span className={styles.petDetailIcon}>
                        {pet.gender === "Macho" ? "♂️" : "♀️"}
                      </span>
                      {pet.gender}
                    </span>
                    <span className={styles.petDetail}>
                      <span className={styles.petDetailIcon}>📏</span>
                      {pet.size === "SMALL"
                        ? "Pequeno"
                        : pet.size === "MEDIUM"
                          ? "Medio"
                          : "Grande"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Login */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🔒</div>
            <h2 className={styles.modalTitle}>Faca login para continuar</h2>
            <p className={styles.modalDescription}>
              Para ver os detalhes deste pet e entrar em contato com o
              responsavel, voce precisa estar logado.
            </p>
            <div className={styles.modalActions}>
              <Link href="/login" className={styles.modalLoginButton}>
                Entrar na minha conta
              </Link>
              <p className={styles.modalRegisterText}>
                Nao tem conta?{" "}
                <Link href="/register" className={styles.modalRegisterLink}>
                  Cadastre-se gratis
                </Link>
              </p>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
