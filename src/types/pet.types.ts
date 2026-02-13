export type PetType = "PET" | "REPTILE" | "RODENT" | "BIRD" | "FISH" | "WILD_ANIMAL";
export type PetSize = "SMALL" | "MEDIUM" | "LARGE";

export type CreatePetInput = {
  pet_type: PetType;
  name: string;
  age?: string;
  gender: string;
  size: PetSize;
  description_history?: string;
  breed?: string;
  color: string;
  status: string;
  responsible_id: string;
  vaccination_history?: string;
  pictures_url?: string[];
};

export type UpdatePetInput = {
  id: string;
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
};

export type PetOutput = {
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
  created_at: Date;
  updated_at: Date;
};
