import {
  CreateResponsibleInput,
  ResponsibleOutput,
} from "@/src/types/responsible.types";

export default interface ResponsibleRepository {
  create({
    email,
    name,
    password,
    type,
    phone_number,
    cpf,
    cnpj,
    address,
    postal_code,
    is_verified,
    picture_url,
  }: CreateResponsibleInput): Promise<ResponsibleOutput>;
  findById(id: string): Promise<ResponsibleOutput | null>;
  findByEmail(email: string): Promise<ResponsibleOutput | null>;
  update({
    id,
    email,
    phone_number,
    address,
    postal_code,
    is_verified,
    picture_url,
  }: {
    id: string;
    email?: string;
    phone_number?: string;
    address?: string;
    postal_code?: string;
    is_verified?: boolean;
    picture_url?: string;
  }): Promise<ResponsibleOutput>;
  delete(id: string): Promise<void>;
}
