export const runtime = "nodejs";

import CreatePetUseCase from "@/src/modules/pet/create-pet.usecase";
import ListPetsUseCase from "@/src/modules/pet/list-pets.usecase";
import PetRepository from "@/src/repositories/pet/pet.repository";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getUserIdFromToken(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value
    || req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return null;

    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const responsibleId = getUserIdFromToken(req);
    if (!responsibleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const repository = new PetRepository();
    const useCase = new CreatePetUseCase(repository);

    const pet = await useCase.exec({
      pet_type: body.pet_type,
      name: body.name,
      age: body.age,
      gender: body.gender,
      size: body.size,
      description_history: body.description_history,
      breed: body.breed,
      color: body.color,
      status: body.status,
      responsible_id: responsibleId,
      vaccination_history: body.vaccination_history,
      pictures_url: body.pictures_url,
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const repository = new PetRepository();
    const useCase = new ListPetsUseCase(repository);

    const { searchParams } = new URL(req.url);
    const responsibleId = searchParams.get("responsible_id") ?? undefined;

    const pets = await useCase.exec(responsibleId);

    return NextResponse.json(pets, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
