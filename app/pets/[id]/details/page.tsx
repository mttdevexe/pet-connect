"use client";

import { useState, useEffect, use, useCallback } from "react";
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
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const photos = pet?.pictures_url ?? [];
  const hasPhotos = photos.length > 0;
  const hasMultiplePhotos = photos.length > 1;

  const openLightbox = useCallback((index: number) => {
    setSelectedPhoto(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrev = useCallback(() => {
    setSelectedPhoto((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setSelectedPhoto((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, goToPrev, goToNext]);

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
          <Link href="/" className={styles.logoContainer}>
            <span className={styles.logoIcon}>🐾</span>
            <h1 className={styles.logoTitle}>Pet Connect</h1>
          </Link>
          <p className={styles.subtitle}>Detalhes do pet</p>
        </div>

        <div className={styles.card}>
          <div
            className={`${styles.imageContainer} ${hasPhotos ? styles.mainImageClickable : ""}`}
            onClick={() => hasPhotos && openLightbox(selectedPhoto)}
          >
            {hasPhotos ? (
              <img
                src={photos[selectedPhoto]}
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
            {hasPhotos && (
              <span className={styles.imageClickHint}>Clique para ampliar</span>
            )}
            {hasMultiplePhotos && (
              <span className={styles.photoCounter}>
                {selectedPhoto + 1}/{photos.length}
              </span>
            )}
          </div>

          {hasMultiplePhotos && (
            <div className={styles.thumbnailStrip}>
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={
                    index === selectedPhoto
                      ? styles.thumbnailActive
                      : styles.thumbnail
                  }
                  onClick={() => setSelectedPhoto(index)}
                >
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className={styles.thumbnailImage}
                  />
                </div>
              ))}
            </div>
          )}

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

            {pet.responsible && (
              <div className={styles.responsibleSection}>
                <h3 className={styles.sectionTitle}>👤 Tutor / Responsavel</h3>
                <div className={styles.responsibleCard}>
                  <div className={styles.responsibleRow}>
                    <span className={styles.responsibleLabel}>Nome</span>
                    <span className={styles.responsibleValue}>
                      {pet.responsible.name}
                    </span>
                  </div>
                  {pet.responsible.phone_number && (
                    <div className={styles.responsibleRow}>
                      <span className={styles.responsibleLabel}>Telefone</span>
                      <div className={styles.responsiblePhoneLinks}>
                        <a
                          href={`https://wa.me/${pet.responsible.phone_number.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.whatsappLink}
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${pet.responsible.phone_number}`}
                          className={styles.responsibleLink}
                        >
                          {pet.responsible.phone_number}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className={styles.responsibleRow}>
                    <span className={styles.responsibleLabel}>E-mail</span>
                    <a
                      href={`mailto:${pet.responsible.email}`}
                      className={styles.responsibleLink}
                    >
                      {pet.responsible.email}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && hasPhotos && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            ✕
          </button>

          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            {hasMultiplePhotos && (
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={goToPrev}
              >
                ‹
              </button>
            )}

            <img
              src={photos[selectedPhoto]}
              alt={`${pet.name} - Foto ${selectedPhoto + 1}`}
              className={styles.lightboxImage}
            />

            {hasMultiplePhotos && (
              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={goToNext}
              >
                ›
              </button>
            )}
          </div>

          {hasMultiplePhotos && (
            <div
              className={styles.lightboxThumbnails}
              onClick={(e) => e.stopPropagation()}
            >
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={
                    index === selectedPhoto
                      ? styles.lightboxThumbActive
                      : styles.lightboxThumb
                  }
                  onClick={() => setSelectedPhoto(index)}
                >
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className={styles.lightboxThumbImage}
                  />
                </div>
              ))}
            </div>
          )}

          <div className={styles.lightboxCounter}>
            {selectedPhoto + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
