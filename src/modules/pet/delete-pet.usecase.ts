import PetRepository from "@/src/repositories/pet/pet.repository";

export default class DeletePetUseCase {
  constructor(private readonly petRepository: PetRepository) {}

  async exec(id: string, responsibleId: string): Promise<void> {
    if (!id) {
      throw new Error("Pet ID is required.");
    }

    const pet = await this.petRepository.findById(id);

    if (!pet) {
      throw new Error("Pet not found.");
    }

    if (pet.responsible_id !== responsibleId) {
      throw new Error("You are not allowed to delete this pet.");
    }

    await this.petRepository.delete(id);
  }
}
