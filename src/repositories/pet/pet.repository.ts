import {
  CreatePetInput,
  UpdatePetInput,
  PetOutput,
  PetWithResponsibleOutput,
} from "@/src/types/pet.types";
import PetRepositoryInterface from "./pet.interface";
import { prisma } from "@/prisma/prisma.client";

export default class PetRepository implements PetRepositoryInterface {
  async create({
    pet_type,
    name,
    age,
    gender,
    size,
    description_history,
    breed,
    color,
    status,
    responsible_id,
    vaccination_history,
    pictures_url,
  }: CreatePetInput): Promise<PetOutput> {
    const pet = await prisma.pet.create({
      data: {
        pet_type,
        name,
        age,
        gender,
        size,
        description_history,
        breed,
        color,
        status,
        responsible_id,
        vaccination_history,
        pictures_url: pictures_url ?? [],
      },
    });

    return pet;
  }

  async findById(id: string): Promise<PetWithResponsibleOutput | null> {
    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        responsible: {
          select: {
            name: true,
            phone_number: true,
            email: true,
          },
        },
      },
    });

    return pet as PetWithResponsibleOutput | null;
  }

  async findAllByResponsibleId(responsibleId: string): Promise<PetOutput[]> {
    const pets = await prisma.pet.findMany({
      where: { responsible_id: responsibleId },
      orderBy: { created_at: "desc" },
    });

    return pets;
  }

  async findAll(): Promise<PetOutput[]> {
    const pets = await prisma.pet.findMany({
      orderBy: { created_at: "desc" },
    });

    return pets;
  }

  async update({
    id,
    pet_type,
    name,
    age,
    gender,
    size,
    description_history,
    breed,
    color,
    status,
    vaccination_history,
    pictures_url,
  }: UpdatePetInput): Promise<PetOutput> {
    const hasAnyFieldToUpdate =
      pet_type !== undefined ||
      name !== undefined ||
      age !== undefined ||
      gender !== undefined ||
      size !== undefined ||
      description_history !== undefined ||
      breed !== undefined ||
      color !== undefined ||
      status !== undefined ||
      vaccination_history !== undefined ||
      pictures_url !== undefined;

    if (!hasAnyFieldToUpdate) {
      throw new Error("At least one field must be provided to update.");
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: {
        pet_type,
        name,
        age,
        gender,
        size,
        description_history,
        breed,
        color,
        status,
        vaccination_history,
        pictures_url,
      },
    });

    return pet;
  }

  async delete(id: string): Promise<void> {
    await prisma.pet.delete({
      where: { id },
    });
  }
}
