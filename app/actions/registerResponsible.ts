export type ResponsibleType = "INDIVIDUAL" | "ORGANIZATION";

export interface RegisterResponsibleData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  cnpj?: string;
  type: ResponsibleType;
  phone_number?: string;
  address?: string;
  postal_code?: string;
}

export async function registerResponsible(
  data: RegisterResponsibleData
): Promise<void> {
  const response = await fetch("/api/responsible", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      cnpj: data.type === "ORGANIZATION" ? data.cnpj : undefined,
      type: data.type,
      phone_number: data.phone_number || undefined,
      address: data.address || undefined,
      postal_code: data.postal_code || undefined,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao criar conta.");
  }
}
