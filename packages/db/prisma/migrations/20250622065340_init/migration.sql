/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArticleTranslation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Article` DROP FOREIGN KEY `Article_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `ArticleTranslation` DROP FOREIGN KEY `ArticleTranslation_article_id_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Article`;

-- DropTable
DROP TABLE `ArticleTranslation`;

-- CreateTable
CREATE TABLE `ServiceArticle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author_id` INTEGER NOT NULL,
    `primaryImage` VARCHAR(191) NOT NULL,
    `status` ENUM('draft', 'published') NOT NULL,
    `published_at` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceArticleTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceArticleId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `primaryTitle` VARCHAR(191) NULL,
    `subPrimaryTitle` VARCHAR(191) NULL,
    `secondTitle` VARCHAR(191) NULL,
    `subSecondTitle` VARCHAR(191) NULL,
    `secondImage` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `content` TEXT NULL,

    UNIQUE INDEX `ServiceArticleTranslation_serviceArticleId_language_key`(`serviceArticleId`, `language`),
    UNIQUE INDEX `ServiceArticleTranslation_slug_language_key`(`slug`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobArticle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author_id` INTEGER NOT NULL,
    `primaryImage` VARCHAR(191) NOT NULL,
    `status` ENUM('draft', 'published') NOT NULL,
    `published_at` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `jobDeadline` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobArticleTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobArticleId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `jobTitle` VARCHAR(191) NOT NULL,
    `jobPosition` VARCHAR(191) NOT NULL,
    `jobLocation` VARCHAR(191) NOT NULL,
    `jobBenefits` VARCHAR(191) NULL,
    `jobDescription` VARCHAR(191) NULL,
    `jobRequirements` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `content` TEXT NULL,

    UNIQUE INDEX `JobArticleTranslation_jobArticleId_language_key`(`jobArticleId`, `language`),
    UNIQUE INDEX `JobArticleTranslation_slug_language_key`(`slug`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsArticle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author_id` INTEGER NOT NULL,
    `primaryImage` VARCHAR(191) NOT NULL,
    `status` ENUM('draft', 'published') NOT NULL,
    `published_at` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `newsCategoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsArticleTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `newsArticleId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `content` TEXT NULL,

    UNIQUE INDEX `NewsArticleTranslation_newsArticleId_language_key`(`newsArticleId`, `language`),
    UNIQUE INDEX `NewsArticleTranslation_slug_language_key`(`slug`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceTitleContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceArticleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceTitleContentTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceTitleContentId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ServiceTitleContentTranslation_serviceTitleContentId_languag_key`(`serviceTitleContentId`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceTitleContentId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceContentTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceContentId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `content` TEXT NULL,

    UNIQUE INDEX `ServiceContentTranslation_serviceContentId_language_key`(`serviceContentId`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceContentId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `newsArticleId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsContentTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `newsContentId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `content` TEXT NULL,

    UNIQUE INDEX `NewsContentTranslation_newsContentId_language_key`(`newsContentId`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsCategoryTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `newsCategoryId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `NewsCategoryTranslation_newsCategoryId_language_key`(`newsCategoryId`, `language`),
    UNIQUE INDEX `NewsCategoryTranslation_language_name_key`(`language`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `newsContentId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsSubImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `newsContentId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `ServiceArticle` ADD CONSTRAINT `ServiceArticle_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceArticleTranslation` ADD CONSTRAINT `ServiceArticleTranslation_serviceArticleId_fkey` FOREIGN KEY (`serviceArticleId`) REFERENCES `ServiceArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobArticle` ADD CONSTRAINT `JobArticle_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobArticleTranslation` ADD CONSTRAINT `JobArticleTranslation_jobArticleId_fkey` FOREIGN KEY (`jobArticleId`) REFERENCES `JobArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_newsCategoryId_fkey` FOREIGN KEY (`newsCategoryId`) REFERENCES `NewsCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticleTranslation` ADD CONSTRAINT `NewsArticleTranslation_newsArticleId_fkey` FOREIGN KEY (`newsArticleId`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceTitleContent` ADD CONSTRAINT `ServiceTitleContent_serviceArticleId_fkey` FOREIGN KEY (`serviceArticleId`) REFERENCES `ServiceArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceTitleContentTranslation` ADD CONSTRAINT `ServiceTitleContentTranslation_serviceTitleContentId_fkey` FOREIGN KEY (`serviceTitleContentId`) REFERENCES `ServiceTitleContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContent` ADD CONSTRAINT `ServiceContent_serviceTitleContentId_fkey` FOREIGN KEY (`serviceTitleContentId`) REFERENCES `ServiceTitleContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContentTranslation` ADD CONSTRAINT `ServiceContentTranslation_serviceContentId_fkey` FOREIGN KEY (`serviceContentId`) REFERENCES `ServiceContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceImage` ADD CONSTRAINT `ServiceImage_serviceContentId_fkey` FOREIGN KEY (`serviceContentId`) REFERENCES `ServiceContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsContent` ADD CONSTRAINT `NewsContent_newsArticleId_fkey` FOREIGN KEY (`newsArticleId`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsContentTranslation` ADD CONSTRAINT `NewsContentTranslation_newsContentId_fkey` FOREIGN KEY (`newsContentId`) REFERENCES `NewsContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsCategoryTranslation` ADD CONSTRAINT `NewsCategoryTranslation_newsCategoryId_fkey` FOREIGN KEY (`newsCategoryId`) REFERENCES `NewsCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsImage` ADD CONSTRAINT `NewsImage_newsContentId_fkey` FOREIGN KEY (`newsContentId`) REFERENCES `NewsContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsSubImage` ADD CONSTRAINT `NewsSubImage_newsContentId_fkey` FOREIGN KEY (`newsContentId`) REFERENCES `NewsContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
