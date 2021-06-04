-- CreateTable
CREATE TABLE `Avatar` (
    `torsoColour` VARCHAR(191) NOT NULL DEFAULT 'blue',
    `armColour` VARCHAR(191) NOT NULL DEFAULT 'blue',
    `legColour` VARCHAR(191) NOT NULL DEFAULT 'blue',
    `headColour` VARCHAR(191) NOT NULL DEFAULT 'blue',
    `avatarEmail` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`avatarEmail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3),

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Planner` (
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3),

    UNIQUE INDEX `Planner.email_unique`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Workout` (
    `workoutID` VARCHAR(191) NOT NULL,
    `workoutTitle` VARCHAR(191) NOT NULL,
    `workoutDescription` VARCHAR(191) NOT NULL,
    `difficulty` ENUM('EASY', 'MEDIUM', 'HARD', 'EXTREME') NOT NULL,
    `planner_Email` VARCHAR(191),

    PRIMARY KEY (`workoutID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercise` (
    `exercise` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `repRange` VARCHAR(191) NOT NULL,
    `sets` INTEGER NOT NULL,
    `Posedescription` VARCHAR(191) NOT NULL,
    `restPeriod` INTEGER NOT NULL,
    `difficulty` ENUM('EASY', 'MEDIUM', 'HARD', 'EXTREME') NOT NULL,
    `duratime` INTEGER NOT NULL,
    `workoutWorkoutID` VARCHAR(191),

    PRIMARY KEY (`exercise`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Avatar` ADD FOREIGN KEY (`avatarEmail`) REFERENCES `Client`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Workout` ADD FOREIGN KEY (`planner_Email`) REFERENCES `Planner`(`email`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD FOREIGN KEY (`workoutWorkoutID`) REFERENCES `Workout`(`workoutID`) ON DELETE SET NULL ON UPDATE CASCADE;
