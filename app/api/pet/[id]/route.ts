export const runtime = "nodejs";

import GetPetUseCase from "@/src/modules/pet/get-pet.usecase";
import UpdatePetUseCase from "@/src/modules/pet/update-pet.usecase";
import DeletePetUseCase from "@/src/modules/pet/delete-pet.usecase";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const repository = new PetRepository();
    const useCase = new GetPetUseCase(repository);

    const pet = await useCase.exec(id);

    return NextResponse.json(pet, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const responsibleId = getUserIdFromToken(req);
    if (!responsibleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const repository = new PetRepository();
    const useCase = new UpdatePetUseCase(repository);

    const pet = await useCase.exec(
      {
        id,
        pet_type: body.pet_type,
        name: body.name,
        age: body.age,
        gender: body.gender,
        size: body.size,
        description_history: body.description_history,
        breed: body.breed,
        color: body.color,
        status: body.status,
        vaccination_history: body.vaccination_history,
        pictures_url: body.pictures_url,
      },
      responsibleId
    );

    return NextResponse.json(pet, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const responsibleId = getUserIdFromToken(req);
    if (!responsibleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const repository = new PetRepository();
    const useCase = new DeletePetUseCase(repository);

    await useCase.exec(id, responsibleId);

    return NextResponse.json({ message: "Pet deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
