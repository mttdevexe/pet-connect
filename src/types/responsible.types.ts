export type ResponsibleType = "INDIVIDUAL" | "ORGANIZATION";

export type CreateResponsibleInput = {
  email: string;
  name: string;
  password: string;
  cpf: string;
  cnpj?: string;
  type: ResponsibleType;
  phone_number?: string;
  address?: string;
  postal_code?: string;
  is_verified?: boolean;
  picture_url?: string;
};

export type ResponsibleOutput = {
  email: string;
  name: string;
  type: ResponsibleType;
  phone_number?: string | null;
  cpf: string | null;
  cnpj?: string | null;
  address?: string | null;
  postal_code?: string | null;
  is_verified?: boolean;
  picture_url?: string | null;
  created_at: Date;
  updated_at: Date;
};
