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
  async findById(id: string): Promise<ResponsibleOutput | null> {
    const responsible = await prisma.responsible.findUnique({
      where: {
        id,
      },
    });

    return responsible;
  }
  async findByEmail(email: string): Promise<ResponsibleOutput | null> {
    const responsible = await prisma.responsible.findUnique({
      where: {
        email,
      },
    });

    return responsible;
  }
  async findByEmailWithPassword(
    email: string,
  ): Promise<(ResponsibleOutput & { id: string; password: string }) | null> {
    const responsible = await prisma.responsible.findUnique({
      where: {
        email,
      },
    });

    return responsible;
  }
  async update({
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
    const hasAnyFieldToUpdate =
      email !== undefined ||
      phone_number !== undefined ||
      address !== undefined ||
      postal_code !== undefined ||
      is_verified !== undefined ||
      picture_url !== undefined;

    if (!hasAnyFieldToUpdate) {
      throw new Error("At least one field must be provided to update.");
    }

    const responsible = await prisma.responsible.update({
      where: {
        id,
      },
      data: {
        email,
        phone_number,
        address,
        postal_code,
        is_verified,
        picture_url,
      },
    });

    return responsible;
  }
  async delete(id: string): Promise<void> {
    await prisma.responsible.delete({
      where: {
        id,
      },
    });
  }
}
