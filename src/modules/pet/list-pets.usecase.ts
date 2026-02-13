import PetRepository from "@/src/repositories/pet/pet.repository";
import { PetOutput } from "@/src/types/pet.types";

export default class ListPetsUseCase {
  constructor(private readonly petRepository: PetRepository) {}

  async exec(responsibleId?: string): Promise<PetOutput[]> {
    if (responsibleId) {
      return this.petRepository.findAllByResponsibleId(responsibleId);
    }

    return this.petRepository.findAll();
  }
}
