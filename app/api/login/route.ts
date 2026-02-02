import LoginUseCase from "@/src/modules/auth/login.usecase";
import ResponsibleRepository from "@/src/repositories/responsible/responsible.repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const repository = new ResponsibleRepository();
    const useCase = new LoginUseCase(repository);

    const result = await useCase.exec({
      email: body.email,
      password: body.password,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
