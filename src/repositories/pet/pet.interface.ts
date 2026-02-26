import {
  CreatePetInput,
  UpdatePetInput,
  PetOutput,
  PetWithResponsibleOutput,
} from "@/src/types/pet.types";

export default interface PetRepositoryInterface {
  create(data: CreatePetInput): Promise<PetOutput>;
  findById(id: string): Promise<PetWithResponsibleOutput | null>;
  findAllByResponsibleId(responsibleId: string): Promise<PetOutput[]>;
  findAll(): Promise<PetOutput[]>;
  update(data: UpdatePetInput): Promise<PetOutput>;
  delete(id: string): Promise<void>;
}
