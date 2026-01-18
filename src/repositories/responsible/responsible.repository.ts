import {
  CreateResponsibleInput,
  ResponsibleOutput,
} from "@/src/types/responsible.types";
import ResponsibleInterface from "./responsible.interface";
import prisma from "@/prisma/prisma.client";

export default class ResponsibleRepository implements ResponsibleInterface {
  async create({
    email,
    name,
    password,
    cpf,
    cnpj,
    type,
    phone_number,
    address,
    postal_code,
    is_verified,
    picture_url,
  }: CreateResponsibleInput): Promise<ResponsibleOutput> {
    const responsible = await prisma.responsible.create({
      data: {
        email,
        name,
        password,
        cpf,
        cnpj,
        type,
        phone_number,
        address,
        postal_code,
        is_verified,
        picture_url,
      },
    });

    return responsible;
  }
  findById(id: string): Promise<ResponsibleOutput> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<ResponsibleOutput> {
    throw new Error("Method not implemented.");
  }
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
  }): Promise<ResponsibleOutput> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
