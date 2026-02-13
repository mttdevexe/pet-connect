export type PetType = "PET" | "REPTILE" | "RODENT" | "BIRD" | "FISH" | "WILD_ANIMAL";
export type PetSize = "SMALL" | "MEDIUM" | "LARGE";

export interface CreatePetData {
  pet_type: PetType;
  name: string;
  age?: string;
  gender: string;
  size: PetSize;
  description_history?: string;
  breed?: string;
  color: string;
  status: string;
  vaccination_history?: string;
  pictures_url?: string[];
}

export interface UpdatePetData {
  pet_type?: PetType;
  name?: string;
  age?: string;
  gender?: string;
  size?: PetSize;
  description_history?: string;
  breed?: string;
  color?: string;
  status?: string;
  vaccination_history?: string;
  pictures_url?: string[];
}

export interface PetResponse {
  id: string;
  pet_type: PetType;
  name: string;
  age: string | null;
  gender: string;
  size: PetSize;
  description_history: string | null;
  breed: string | null;
  color: string;
  status: string;
  responsible_id: string;
  vaccination_history: string | null;
  pictures_url: string[];
  created_at: string;
  updated_at: string;
}

function getToken(): string {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) throw new Error("Usuário não autenticado.");
  return token;
}

export async function createPet(data: CreatePetData): Promise<PetResponse> {
  const token = getToken();

  const response = await fetch("/api/pet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao cadastrar pet.");
  }

  return responseData;
}

export async function listMyPets(): Promise<PetResponse[]> {
  const token = getToken();

  const user = localStorage.getItem("user");
  if (!user) throw new Error("Usuário não encontrado.");

  const { id } = JSON.parse(user);

  const response = await fetch(`/api/pet?responsible_id=${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao listar pets.");
  }

  return responseData;
}

export async function listAllPets(): Promise<PetResponse[]> {
  const response = await fetch("/api/pet", {
    method: "GET",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao listar pets.");
  }

  return responseData;
}

export async function getPet(id: string): Promise<PetResponse> {
  const response = await fetch(`/api/pet/${id}`, {
    method: "GET",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao buscar pet.");
  }

  return responseData;
}

export async function updatePet(
  id: string,
  data: UpdatePetData
): Promise<PetResponse> {
  const token = getToken();

  const response = await fetch(`/api/pet/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao atualizar pet.");
  }

  return responseData;
}

export async function deletePet(id: string): Promise<void> {
  const token = getToken();

  const response = await fetch(`/api/pet/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao deletar pet.");
  }
}
