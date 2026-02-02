export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    type: "INDIVIDUAL" | "ORGANIZATION";
  };
}

export async function login(data: LoginData): Promise<LoginResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao fazer login.");
  }

  document.cookie = `token=${responseData.token}; path=/; max-age=${7 * 24 * 60 * 60}`;

  return responseData;
}

export function logout(): void {
  document.cookie = "token=; path=/; max-age=0";
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
