/*
  Warnings:

  - Made the column `cpf` on table `responsible` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "responsible" ALTER COLUMN "cpf" SET NOT NULL;
