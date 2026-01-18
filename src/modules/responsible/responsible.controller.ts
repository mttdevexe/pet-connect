import ResponsibleRepository from "@/src/repositories/responsible/responsible.repository";
import CreateResponsibleUseCase from "./create-responsible.usecase";

export default class ResponsibleController {
  constructor(
    private readonly createResponsibleUseCase: CreateResponsibleUseCase,
    private readonly responsibleRepository: ResponsibleRepository,
  ) {}
}
