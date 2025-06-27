import { PrismaClient, ArticleStatus } from '@prisma/client';
import { CreateJobArticleDto, UpdateJobArticleDto } from '../DTOs/request/job-article.input';
import { generateUniqueSlug } from '../utils/slugify';
import { translateJob, translateSingleText } from '../utils/gemini-translate';
import { buildPaginationResult } from '../utils/pagination';

export class JobArticleService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async translateJobArticleData(data: {
    job_title?: string;
    job_position?: string;
    job_location?: string;
    job_benefits?: string;
    job_description?: string;
    job_requirements?: string;
    meta_title?: string;
    meta_description?: string;
    content?: string;
  }, targetLang: "en" | "zh") {

    if (!data.job_title) {
      throw new Error('Job title is required for translation');
    }

    try {
      // Translate main job fields
      const jobTranslation = await translateJob({
      title: data.job_title,
      position: data.job_position,
      location: data.job_location,
      benefits: data.job_benefits,
      description: data.job_description,
      requirements: data.job_requirements,
      targetLang,
    });

      // Translate meta fields and content concurrently and tolerate partial failures
      const metaResults = await Promise.allSettled([
        data.meta_title ? translateSingleText(data.meta_title, targetLang) : Promise.resolve(''),
        data.meta_description ? translateSingleText(data.meta_description, targetLang) : Promise.resolve(''),
        data.content ? translateSingleText(data.content, targetLang) : Promise.resolve(''),
      ]);

      const metaTitleTranslation = metaResults[0].status === 'fulfilled' ? metaResults[0].value : '';
      const metaDescTranslation = metaResults[1].status === 'fulfilled' ? metaResults[1].value : '';
      const contentTranslation  = metaResults[2].status === 'fulfilled' ? metaResults[2].value : '';

    return {
        job_title: jobTranslation.title,
        job_position: jobTranslation.position || '',
        job_location: jobTranslation.location || '',
        job_benefits: jobTranslation.benefits,
        job_description: jobTranslation.description,
        job_requirements: jobTranslation.requirements,
        meta_title: metaTitleTranslation || undefined,
        meta_description: metaDescTranslation || undefined,
        content: contentTranslation || undefined,
        slug: generateUniqueSlug(jobTranslation.title),
    };
    } catch (error) {
      console.error(`Translation failed for language ${targetLang}:`, error);
      throw new Error(`Translation to ${targetLang} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create(authorId: number, dto: CreateJobArticleDto) {
    // Use transaction to ensure rollback on failure
    return await this.prisma.$transaction(async (tx) => {
      try {
    // Tạo bản ghi tiếng Việt
        const jobArticle = await tx.jobArticle.create({
      data: {
        author_id: authorId,
        primary_image: dto.primary_image,
        status: dto.status,
        job_deadline: dto.job_deadline,
        translations: {
          create: {
            language: 'vi',
            job_title: dto.job_title,
            job_position: dto.job_position,
            job_location: dto.job_location,
            job_benefits: dto.job_benefits,
            job_description: dto.job_description,
            job_requirements: dto.job_requirements,
            meta_title: dto.meta_title,
            meta_description: dto.meta_description,
            content: dto.content,
            slug: dto.slug || generateUniqueSlug(dto.job_title),
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        translations: true,
      },
    });

        // Try to create translations concurrently; ignore failures for individual languages
        try {
          const languages: ("en" | "zh")[] = ["en", "zh"];

          // Run translation for all languages concurrently
          const translationResults = await Promise.allSettled(
            languages.map((lang) => this.translateJobArticleData(dto, lang))
          );

          // Persist only successful translations
          await Promise.all(
            translationResults.map((result, index) => {
              if (result.status === "fulfilled") {
                const lang = languages[index];
                return tx.jobArticleTranslation.create({
                  data: {
                    job_article_id: jobArticle.id,
                    language: lang,
                    ...result.value,
                  },
                });
              }
              console.warn(`Translation failed for language ${languages[index]}:`, result.reason);
              return Promise.resolve();
            })
          );

          console.log("Successfully created job article with available translations");
        } catch (translationError) {
          console.warn('Translation processing encountered errors, but Vietnamese version was created successfully:', translationError);
          // Vietnamese record already exists; nothing else to do
        }

        return jobArticle;
      } catch (error) {
        console.error('Failed to create job article:', error);
        throw error; // This will trigger transaction rollback
      }
    });
  }

  async update(id: number, dto: UpdateJobArticleDto) {
    return await this.prisma.$transaction(async (tx) => {
      try {
        const jobArticle = await tx.jobArticle.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!jobArticle) {
      throw new Error('Job article not found');
    }

    // Cập nhật bản tiếng Việt
    const viTranslation = jobArticle.translations.find(t => t.language === 'vi');
        await tx.jobArticle.update({
      where: { id },
      data: {
        primary_image: dto.primary_image,
        status: dto.status,
        job_deadline: dto.job_deadline,
        translations: {
          update: {
            where: { id: viTranslation?.id },
            data: {
              job_title: dto.job_title,
              job_position: dto.job_position,
              job_location: dto.job_location,
              job_benefits: dto.job_benefits,
              job_description: dto.job_description,
              job_requirements: dto.job_requirements,
              meta_title: dto.meta_title,
              meta_description: dto.meta_description,
              content: dto.content,
              slug: dto.slug || (dto.job_title ? generateUniqueSlug(dto.job_title) : ''),
            },
          },
        },
      },
    });

        // Try to update translations concurrently; ignore failures for individual languages
        try {
          const languages: ("en" | "zh")[] = ["en", "zh"];

          // Translate all languages concurrently
          const translationResults = await Promise.allSettled(
            languages.map((lang) => this.translateJobArticleData(dto, lang))
          );

          await Promise.all(
            translationResults.map((result, index) => {
              const lang = languages[index];
              const existingTranslation = jobArticle.translations.find((t) => t.language === lang);

              if (result.status === "fulfilled") {
                if (existingTranslation) {
                  return tx.jobArticleTranslation.update({
                    where: { id: existingTranslation.id },
                    data: result.value,
                  });
                }
                return tx.jobArticleTranslation.create({
                  data: {
                    job_article_id: id,
                    language: lang,
                    ...result.value,
                  },
                });
              }

              console.warn(`Translation failed for language ${lang}:`, result.reason);
              return Promise.resolve();
            })
          );

          console.log('Successfully updated job article with available translations');
        } catch (translationError) {
          console.warn('Translation processing encountered errors during update, but Vietnamese version was updated successfully:', translationError);
          // Continue without updating translations
        }

        return await this.findOne(id);
      } catch (error) {
        console.error('Failed to update job article with translations:', error);
        throw error; // This will trigger transaction rollback
      }
    });
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    skip?: number;
    take?: number;
    status?: ArticleStatus;
    language?: string;
  }) {
    const {
      skip = 0,
      take = 10,
      page = 1,
      pageSize = 10,
      status,
      language = 'vi',
    } = params;

    const whereFilter = {
      status,
      translations: {
        some: {
          language,
        },
      },
    } as const;

    const [data, total] = await Promise.all([
      this.prisma.jobArticle.findMany({
        skip,
        take,
        where: whereFilter,
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          translations: {
            where: {
              language,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.jobArticle.count({ where: whereFilter }),
    ]);

    return buildPaginationResult(data, total, page, pageSize);
  }

  async findOne(id: number, language = 'vi') {
    return this.prisma.jobArticle.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        translations: {
          where: {
            language,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.jobArticle.delete({
      where: { id },
    });
  }
} 