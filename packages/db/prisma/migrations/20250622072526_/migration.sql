/*
  Warnings:

  - You are about to drop the column `createdAt` on the `JobArticle` table. All the data in the column will be lost.
  - You are about to drop the column `jobDeadline` on the `JobArticle` table. All the data in the column will be lost.
  - You are about to drop the column `primaryImage` on the `JobArticle` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `JobArticle` table. All the data in the column will be lost.
  - You are about to drop the column `jobArticleId` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `jobBenefits` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `jobDescription` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `jobLocation` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `jobPosition` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `jobRequirements` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `JobArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `newsCategoryId` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `primaryImage` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `NewsArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `NewsArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `newsArticleId` on the `NewsArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `newsCategoryId` on the `NewsCategoryTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `newsArticleId` on the `NewsContent` table. All the data in the column will be lost.
  - You are about to drop the column `newsContentId` on the `NewsContentTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `newsContentId` on the `NewsImage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ServiceArticle` table. All the data in the column will be lost.
  - You are about to drop the column `primaryImage` on the `ServiceArticle` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ServiceArticle` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `ServiceArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `ServiceArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `primaryTitle` on the `ServiceArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `secondImage` on the `ServiceArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `secondTitle` on the `ServiceArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `serviceArticleId` on the `ServiceArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `subPrimaryTitle` on the `ServiceArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `subSecondTitle` on the `ServiceArticleTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `serviceTitleContentId` on the `ServiceContent` table. All the data in the column will be lost.
  - You are about to drop the column `serviceContentId` on the `ServiceContentTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `serviceContentId` on the `ServiceImage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SystemConfig` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SystemConfig` table. All the data in the column will be lost.
  - You are about to drop the `NewsSubImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceTitleContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceTitleContentTranslation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[job_article_id,language]` on the table `JobArticleTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[news_article_id,language]` on the table `NewsArticleTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[news_category_id,language]` on the table `NewsCategoryTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[news_content_id,language]` on the table `NewsContentTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_article_id,language]` on the table `ServiceArticleTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_content_id,language]` on the table `ServiceContentTranslation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `job_deadline` to the `JobArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primary_image` to the `JobArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `JobArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_article_id` to the `JobArticleTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_location` to the `JobArticleTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_position` to the `JobArticleTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_title` to the `JobArticleTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `news_category_id` to the `NewsArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primary_image` to the `NewsArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `NewsArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `news_article_id` to the `NewsArticleTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `news_category_id` to the `NewsCategoryTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `news_article_id` to the `NewsContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `news_content_id` to the `NewsContentTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `news_content_id` to the `NewsImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_images_content` to the `NewsImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primary_image` to the `ServiceArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ServiceArticle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_article_id` to the `ServiceArticleTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_article_id` to the `ServiceContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_content_id` to the `ServiceContentTranslation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_content_id` to the `ServiceImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SystemConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `JobArticleTranslation` DROP FOREIGN KEY `JobArticleTranslation_jobArticleId_fkey`;

-- DropForeignKey
ALTER TABLE `NewsArticle` DROP FOREIGN KEY `NewsArticle_newsCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `NewsArticleTranslation` DROP FOREIGN KEY `NewsArticleTranslation_newsArticleId_fkey`;

-- DropForeignKey
ALTER TABLE `NewsCategoryTranslation` DROP FOREIGN KEY `NewsCategoryTranslation_newsCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `NewsContent` DROP FOREIGN KEY `NewsContent_newsArticleId_fkey`;

-- DropForeignKey
ALTER TABLE `NewsContentTranslation` DROP FOREIGN KEY `NewsContentTranslation_newsContentId_fkey`;

-- DropForeignKey
ALTER TABLE `NewsImage` DROP FOREIGN KEY `NewsImage_newsContentId_fkey`;

-- DropForeignKey
ALTER TABLE `NewsSubImage` DROP FOREIGN KEY `NewsSubImage_newsContentId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceArticleTranslation` DROP FOREIGN KEY `ServiceArticleTranslation_serviceArticleId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceContent` DROP FOREIGN KEY `ServiceContent_serviceTitleContentId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceContentTranslation` DROP FOREIGN KEY `ServiceContentTranslation_serviceContentId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceImage` DROP FOREIGN KEY `ServiceImage_serviceContentId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceTitleContent` DROP FOREIGN KEY `ServiceTitleContent_serviceArticleId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceTitleContentTranslation` DROP FOREIGN KEY `ServiceTitleContentTranslation_serviceTitleContentId_fkey`;

-- DropIndex
DROP INDEX `JobArticleTranslation_jobArticleId_language_key` ON `JobArticleTranslation`;

-- DropIndex
DROP INDEX `NewsArticle_newsCategoryId_fkey` ON `NewsArticle`;

-- DropIndex
DROP INDEX `NewsArticleTranslation_newsArticleId_language_key` ON `NewsArticleTranslation`;

-- DropIndex
DROP INDEX `NewsCategoryTranslation_newsCategoryId_language_key` ON `NewsCategoryTranslation`;

-- DropIndex
DROP INDEX `NewsContent_newsArticleId_fkey` ON `NewsContent`;

-- DropIndex
DROP INDEX `NewsContentTranslation_newsContentId_language_key` ON `NewsContentTranslation`;

-- DropIndex
DROP INDEX `NewsImage_newsContentId_fkey` ON `NewsImage`;

-- DropIndex
DROP INDEX `ServiceArticleTranslation_serviceArticleId_language_key` ON `ServiceArticleTranslation`;

-- DropIndex
DROP INDEX `ServiceContent_serviceTitleContentId_fkey` ON `ServiceContent`;

-- DropIndex
DROP INDEX `ServiceContentTranslation_serviceContentId_language_key` ON `ServiceContentTranslation`;

-- DropIndex
DROP INDEX `ServiceImage_serviceContentId_fkey` ON `ServiceImage`;

-- AlterTable
ALTER TABLE `JobArticle` DROP COLUMN `createdAt`,
    DROP COLUMN `jobDeadline`,
    DROP COLUMN `primaryImage`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `job_deadline` DATETIME(3) NOT NULL,
    ADD COLUMN `primary_image` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `JobArticleTranslation` DROP COLUMN `jobArticleId`,
    DROP COLUMN `jobBenefits`,
    DROP COLUMN `jobDescription`,
    DROP COLUMN `jobLocation`,
    DROP COLUMN `jobPosition`,
    DROP COLUMN `jobRequirements`,
    DROP COLUMN `jobTitle`,
    DROP COLUMN `metaDescription`,
    DROP COLUMN `metaTitle`,
    ADD COLUMN `job_article_id` INTEGER NOT NULL,
    ADD COLUMN `job_benefits` VARCHAR(191) NULL,
    ADD COLUMN `job_description` VARCHAR(191) NULL,
    ADD COLUMN `job_location` VARCHAR(191) NOT NULL,
    ADD COLUMN `job_position` VARCHAR(191) NOT NULL,
    ADD COLUMN `job_requirements` VARCHAR(191) NULL,
    ADD COLUMN `job_title` VARCHAR(191) NOT NULL,
    ADD COLUMN `meta_description` VARCHAR(191) NULL,
    ADD COLUMN `meta_title` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `NewsArticle` DROP COLUMN `createdAt`,
    DROP COLUMN `newsCategoryId`,
    DROP COLUMN `primaryImage`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `news_category_id` INTEGER NOT NULL,
    ADD COLUMN `primary_image` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `NewsArticleTranslation` DROP COLUMN `metaDescription`,
    DROP COLUMN `metaTitle`,
    DROP COLUMN `newsArticleId`,
    ADD COLUMN `meta_description` VARCHAR(191) NULL,
    ADD COLUMN `meta_title` VARCHAR(191) NULL,
    ADD COLUMN `news_article_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `NewsCategoryTranslation` DROP COLUMN `newsCategoryId`,
    ADD COLUMN `news_category_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `NewsContent` DROP COLUMN `newsArticleId`,
    ADD COLUMN `news_article_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `NewsContentTranslation` DROP COLUMN `newsContentId`,
    ADD COLUMN `news_content_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `NewsImage` DROP COLUMN `newsContentId`,
    ADD COLUMN `news_content_id` INTEGER NOT NULL,
    ADD COLUMN `sub_images_content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ServiceArticle` DROP COLUMN `createdAt`,
    DROP COLUMN `primaryImage`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `primary_image` VARCHAR(191) NOT NULL,
    ADD COLUMN `second_image` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `ServiceArticleTranslation` DROP COLUMN `metaDescription`,
    DROP COLUMN `metaTitle`,
    DROP COLUMN `primaryTitle`,
    DROP COLUMN `secondImage`,
    DROP COLUMN `secondTitle`,
    DROP COLUMN `serviceArticleId`,
    DROP COLUMN `subPrimaryTitle`,
    DROP COLUMN `subSecondTitle`,
    ADD COLUMN `meta_description` VARCHAR(191) NULL,
    ADD COLUMN `meta_title` VARCHAR(191) NULL,
    ADD COLUMN `primary_title` VARCHAR(191) NULL,
    ADD COLUMN `second_title` VARCHAR(191) NULL,
    ADD COLUMN `service_article_id` INTEGER NOT NULL,
    ADD COLUMN `sub_primary_title` VARCHAR(191) NULL,
    ADD COLUMN `sub_second_title` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ServiceContent` DROP COLUMN `serviceTitleContentId`,
    ADD COLUMN `service_article_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ServiceContentTranslation` DROP COLUMN `serviceContentId`,
    ADD COLUMN `service_content_id` INTEGER NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ServiceImage` DROP COLUMN `serviceContentId`,
    ADD COLUMN `service_content_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `SystemConfig` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `NewsSubImage`;

-- DropTable
DROP TABLE `ServiceTitleContent`;

-- DropTable
DROP TABLE `ServiceTitleContentTranslation`;

-- CreateIndex
CREATE UNIQUE INDEX `JobArticleTranslation_job_article_id_language_key` ON `JobArticleTranslation`(`job_article_id`, `language`);

-- CreateIndex
CREATE UNIQUE INDEX `NewsArticleTranslation_news_article_id_language_key` ON `NewsArticleTranslation`(`news_article_id`, `language`);

-- CreateIndex
CREATE UNIQUE INDEX `NewsCategoryTranslation_news_category_id_language_key` ON `NewsCategoryTranslation`(`news_category_id`, `language`);

-- CreateIndex
CREATE UNIQUE INDEX `NewsContentTranslation_news_content_id_language_key` ON `NewsContentTranslation`(`news_content_id`, `language`);

-- CreateIndex
CREATE UNIQUE INDEX `ServiceArticleTranslation_service_article_id_language_key` ON `ServiceArticleTranslation`(`service_article_id`, `language`);

-- CreateIndex
CREATE UNIQUE INDEX `ServiceContentTranslation_service_content_id_language_key` ON `ServiceContentTranslation`(`service_content_id`, `language`);

-- AddForeignKey
ALTER TABLE `ServiceArticleTranslation` ADD CONSTRAINT `ServiceArticleTranslation_service_article_id_fkey` FOREIGN KEY (`service_article_id`) REFERENCES `ServiceArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobArticleTranslation` ADD CONSTRAINT `JobArticleTranslation_job_article_id_fkey` FOREIGN KEY (`job_article_id`) REFERENCES `JobArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_news_category_id_fkey` FOREIGN KEY (`news_category_id`) REFERENCES `NewsCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticleTranslation` ADD CONSTRAINT `NewsArticleTranslation_news_article_id_fkey` FOREIGN KEY (`news_article_id`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContent` ADD CONSTRAINT `ServiceContent_service_article_id_fkey` FOREIGN KEY (`service_article_id`) REFERENCES `ServiceArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContentTranslation` ADD CONSTRAINT `ServiceContentTranslation_service_content_id_fkey` FOREIGN KEY (`service_content_id`) REFERENCES `ServiceContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceImage` ADD CONSTRAINT `ServiceImage_service_content_id_fkey` FOREIGN KEY (`service_content_id`) REFERENCES `ServiceContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsContent` ADD CONSTRAINT `NewsContent_news_article_id_fkey` FOREIGN KEY (`news_article_id`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsContentTranslation` ADD CONSTRAINT `NewsContentTranslation_news_content_id_fkey` FOREIGN KEY (`news_content_id`) REFERENCES `NewsContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsCategoryTranslation` ADD CONSTRAINT `NewsCategoryTranslation_news_category_id_fkey` FOREIGN KEY (`news_category_id`) REFERENCES `NewsCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsImage` ADD CONSTRAINT `NewsImage_news_content_id_fkey` FOREIGN KEY (`news_content_id`) REFERENCES `NewsContent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
