import PetRepository from "@/src/repositories/pet/pet.repository";
import { PetOutput } from "@/src/types/pet.types";

export default class GetPetUseCase {
  constructor(private readonly petRepository: PetRepository) {}

  async exec(id: string): Promise<PetOutput> {
    if (!id) {
      throw new Error("Pet ID is required.");
    }

    const pet = await this.petRepository.findById(id);

    if (!pet) {
      throw new Error("Pet not found.");
    }

    return pet;
  }
}
