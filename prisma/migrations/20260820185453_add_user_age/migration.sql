/*
  Warnings:

  - You are about to drop the column `concluid` on the `Task` table. All the data in the column will be lost.
  - Added the required column `age` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "concluid",
ADD COLUMN     "age" INTEGER NOT NULL;
