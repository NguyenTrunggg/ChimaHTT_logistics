/*
  Warnings:

  - You are about to drop the `NewsArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewsArticleTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewsContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewsContentTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewsImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceArticleTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceContentTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `NewsArticle` DROP FOREIGN KEY `NewsArticle_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `NewsArticle` DROP FOREIGN KEY `NewsArticle_news_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `NewsArticleTranslation` DROP FOREIGN KEY `NewsArticleTranslation_news_article_id_fkey`;

-- DropForeignKey
ALTER TABLE `NewsContent` DROP FOREIGN KEY `NewsContent_news_article_id_fkey`;

-- DropForeignKey
ALTER TABLE `NewsContentTranslation` DROP FOREIGN KEY `NewsContentTranslation_news_content_id_fkey`;

-- DropForeignKey
ALTER TABLE `NewsImage` DROP FOREIGN KEY `NewsImage_news_content_id_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceArticle` DROP FOREIGN KEY `ServiceArticle_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceArticleTranslation` DROP FOREIGN KEY `ServiceArticleTranslation_service_article_id_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceContent` DROP FOREIGN KEY `ServiceContent_service_article_id_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceContentTranslation` DROP FOREIGN KEY `ServiceContentTranslation_service_content_id_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceImage` DROP FOREIGN KEY `ServiceImage_service_content_id_fkey`;

-- AlterTable
ALTER TABLE `JobArticleTranslation` MODIFY `job_benefits` TEXT NULL,
    MODIFY `job_description` TEXT NULL,
    MODIFY `job_requirements` TEXT NULL,
    MODIFY `meta_description` TEXT NULL;

-- DropTable
DROP TABLE `NewsArticle`;

-- DropTable
DROP TABLE `NewsArticleTranslation`;

-- DropTable
DROP TABLE `NewsContent`;

-- DropTable
DROP TABLE `NewsContentTranslation`;

-- DropTable
DROP TABLE `NewsImage`;

-- DropTable
DROP TABLE `ServiceArticle`;

-- DropTable
DROP TABLE `ServiceArticleTranslation`;

-- DropTable
DROP TABLE `ServiceContent`;

-- DropTable
DROP TABLE `ServiceContentTranslation`;

-- DropTable
DROP TABLE `ServiceImage`;

-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `main_image` VARCHAR(191) NOT NULL,
    `published_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `author_id` INTEGER NOT NULL,
    `tag` VARCHAR(191) NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `News_author_id_fkey`(`author_id`),
    INDEX `News_category_id_fkey`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `news_id` INTEGER NOT NULL,
    `language` VARCHAR(10) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,

    UNIQUE INDEX `NewsTranslation_news_id_language_key`(`news_id`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `main_image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER NOT NULL,
    `language` VARCHAR(10) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `features` JSON NOT NULL,

    UNIQUE INDEX `ServiceTranslation_service_id_language_key`(`service_id`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `NewsCategory`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsTranslation` ADD CONSTRAINT `NewsTranslation_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `News`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceTranslation` ADD CONSTRAINT `ServiceTranslation_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
