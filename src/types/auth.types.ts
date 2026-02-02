export type LoginInput = {
  email: string;
  password: string;
};

export type LoginOutput = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    type: "INDIVIDUAL" | "ORGANIZATION";
  };
};
