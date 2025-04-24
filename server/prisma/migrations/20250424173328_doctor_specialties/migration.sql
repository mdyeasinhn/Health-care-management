-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialites" (
    "specialitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctor_specialites_pkey" PRIMARY KEY ("specialitiesId","doctorId")
);

-- AddForeignKey
ALTER TABLE "doctor_specialites" ADD CONSTRAINT "doctor_specialites_specialitiesId_fkey" FOREIGN KEY ("specialitiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialites" ADD CONSTRAINT "doctor_specialites_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
