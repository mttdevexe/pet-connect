-- CreateEnum
CREATE TYPE "ResponsibleType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('PET', 'REPTILE', 'RODENT', 'BIRD', 'FISH', 'WILD_ANIMAL');

-- CreateTable
CREATE TABLE "Responsible" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT,
    "cnpj" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "ResponsibleType" NOT NULL,
    "phone_number" TEXT,
    "address" TEXT,
    "postal_code" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "picture_url" TEXT,

    CONSTRAINT "Responsible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "pet_type" "PetType" NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT,
    "gender" TEXT NOT NULL,
    "size" "PetSize" NOT NULL,
    "description_history" TEXT,
    "breed" TEXT,
    "color" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "responsible_id" TEXT NOT NULL,
    "vaccination_history" TEXT,
    "pictures_url" TEXT[],

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsible_email_key" ON "Responsible"("email");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "Responsible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
