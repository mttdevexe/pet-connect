import CreateResponsibleUseCase from "@/src/modules/responsible/create-responsible.usecase";
import ResponsibleRepository from "@/src/repositories/responsible/responsible.repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const repository = new ResponsibleRepository();
    const useCase = new CreateResponsibleUseCase(repository);

    const responsible = await useCase.exec({
      email: body.email,
      name: body.name,
      password: body.password,
      cpf: body.cpf,
      cnpj: body.cnpj,
      type: body.type,
      phone_number: body.phone_number,
      address: body.address,
      postal_code: body.postal_code,
      is_verified: body.is_verified,
      picture_url: body.picture_url,
    });

    return NextResponse.json(responsible, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
