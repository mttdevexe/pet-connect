import ResponsibleRepository from "@/src/repositories/responsible/responsible.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginInput, LoginOutput } from "@/src/types/auth.types";

export default class LoginUseCase {
  constructor(private readonly responsibleRepository: ResponsibleRepository) {}

  async exec({ email, password }: LoginInput): Promise<LoginOutput> {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const responsible =
      await this.responsibleRepository.findByEmailWithPassword(email);

    if (!responsible) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      responsible.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined.");
    }

    const token = jwt.sign(
      {
        id: responsible.id,
        email: responsible.email,
        type: responsible.type,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: responsible.id,
        email: responsible.email,
        name: responsible.name,
        type: responsible.type,
      },
    };
  }
}
