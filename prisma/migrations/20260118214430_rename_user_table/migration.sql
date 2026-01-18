/*
  Warnings:

  - You are about to drop the `Pet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Responsible` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_responsible_id_fkey";

-- DropTable
DROP TABLE "Pet";

-- DropTable
DROP TABLE "Responsible";

-- CreateTable
CREATE TABLE "responsible" (
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

    CONSTRAINT "responsible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet" (
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

    CONSTRAINT "pet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "responsible_email_key" ON "responsible"("email");

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
