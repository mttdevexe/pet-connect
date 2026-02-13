import PetRepository from "@/src/repositories/pet/pet.repository";
import { CreatePetInput, PetOutput } from "@/src/types/pet.types";

export default class CreatePetUseCase {
  constructor(private readonly petRepository: PetRepository) {}

  async exec({
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
    if (!pet_type || !name || !gender || !size || !color || !status || !responsible_id) {
      throw new Error("Pet type, name, gender, size, color, status and responsible_id are required.");
    }

    const validPetTypes = ["PET", "REPTILE", "RODENT", "BIRD", "FISH", "WILD_ANIMAL"];
    if (!validPetTypes.includes(pet_type)) {
      throw new Error("Invalid pet type.");
    }

    const validSizes = ["SMALL", "MEDIUM", "LARGE"];
    if (!validSizes.includes(size)) {
      throw new Error("Invalid pet size.");
    }

    const pet = await this.petRepository.create({
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
    });

    return pet;
  }
}
