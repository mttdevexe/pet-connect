import PetRepository from "@/src/repositories/pet/pet.repository";
import { UpdatePetInput, PetOutput } from "@/src/types/pet.types";

export default class UpdatePetUseCase {
  constructor(private readonly petRepository: PetRepository) {}

  async exec(data: UpdatePetInput, responsibleId: string): Promise<PetOutput> {
    if (!data.id) {
      throw new Error("Pet ID is required.");
    }

    const pet = await this.petRepository.findById(data.id);

    if (!pet) {
      throw new Error("Pet not found.");
    }

    if (pet.responsible_id !== responsibleId) {
      throw new Error("You are not allowed to update this pet.");
    }

    if (data.pet_type) {
      const validPetTypes = ["PET", "REPTILE", "RODENT", "BIRD", "FISH", "WILD_ANIMAL"];
      if (!validPetTypes.includes(data.pet_type)) {
        throw new Error("Invalid pet type.");
      }
    }

    if (data.size) {
      const validSizes = ["SMALL", "MEDIUM", "LARGE"];
      if (!validSizes.includes(data.size)) {
        throw new Error("Invalid pet size.");
      }
    }

    const updatedPet = await this.petRepository.update(data);

    return updatedPet;
  }
}
