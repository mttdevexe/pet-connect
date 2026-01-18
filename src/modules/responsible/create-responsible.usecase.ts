import ResponsibleRepository from "@/src/repositories/responsible/responsible.repository";
import bcrypt from "bcrypt";

type CreateResposnibleUseCaseInput = {
  email: string;
  name: string;
  password: string;
  cpf: string;
  cnpj?: string;
  type: "INDIVIDUAL" | "ORGANIZATION";
  phone_number?: string;
  address?: string;
  postal_code?: string;
  is_verified?: boolean;
  picture_url?: string;
};

export default class CreateResponsibleUseCase {
  constructor(private readonly responsibleRepository: ResponsibleRepository) {}

  async exec({
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
  }: CreateResposnibleUseCaseInput) {
    if (!email || !name || !password || !cpf || !type)
      throw new Error("Email, Name, Password, CPF and Type are required.");

    if (type !== "INDIVIDUAL" && type !== "ORGANIZATION")
      throw new Error("Type must be INDIVIDUAL or ORGANIZATION.");

    const userEmail = await this.responsibleRepository.findByEmail(email);
    if (userEmail)
      throw new Error("E-mail already registered as a responsible.");

    if (type === "ORGANIZATION" && cnpj === undefined)
      throw new Error("CNPJ is required for an organization.");

    if (cnpj && cnpj.length < 14) throw new Error("CNPJ is invalid.");

    if (cpf.length < 11) throw new Error("CPF is invalid.");

    const userPassword = await bcrypt.hash(password, 10);
    const responsible = await this.responsibleRepository.create({
      email,
      cpf,
      password: userPassword,
      name,
      type,
      phone_number,
      address,
      postal_code,
      is_verified,
      picture_url,
    });

    return responsible;
  }
}
