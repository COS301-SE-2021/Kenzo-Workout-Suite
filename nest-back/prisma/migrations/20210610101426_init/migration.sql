/*
  Warnings:

  - You are about to drop the column `wasSkipped` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `workout_id` on the `exercise` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `description` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `repRange` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `Posedescription` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `workoutDescription` on the `workout` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.
  - Changed the type of `restPeriod` on the `exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `duratime` on the `exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `exercise_ibfk_1`;

-- AlterTable
ALTER TABLE `exercise` DROP COLUMN `wasSkipped`,
    DROP COLUMN `workout_id`,
    ADD COLUMN `workoutWorkoutID` VARCHAR(191),
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `repRange` VARCHAR(191) NOT NULL,
    MODIFY `Posedescription` VARCHAR(191) NOT NULL,
    DROP COLUMN `restPeriod`,
    ADD COLUMN `restPeriod` INTEGER NOT NULL,
    DROP COLUMN `duratime`,
    ADD COLUMN `duratime` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `workout` MODIFY `workoutTitle` VARCHAR(191) NOT NULL,
    MODIFY `workoutDescription` VARCHAR(191) NOT NULL,
    MODIFY `planner_Email` VARCHAR(191);

-- AddForeignKey
ALTER TABLE `Exercise` ADD FOREIGN KEY (`workoutWorkoutID`) REFERENCES `Workout`(`workoutID`) ON DELETE SET NULL ON UPDATE CASCADE;
