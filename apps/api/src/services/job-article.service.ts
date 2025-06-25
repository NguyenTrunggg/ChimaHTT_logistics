import { PrismaClient, ArticleStatus } from '@prisma/client';
import { CreateJobArticleDto, UpdateJobArticleDto } from '../DTOs/request/job-article.input';
import { slugify, generateUniqueSlug } from '../utils/slugify';
import { translateJob } from '../utils/gemini-translate';
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

    if (!data.job_title || !data.job_position || !data.job_location) {
      throw new Error('Job title, position, and location are required for translation');
    }
    const translation = await translateJob({
      title: data.job_title,
      position: data.job_position,
      location: data.job_location,
      benefits: data.job_benefits,
      description: data.job_description,
      requirements: data.job_requirements,
      targetLang,
    });


    // Handle meta fields and content separately
    const [metaTitleTranslation, metaDescTranslation, contentTranslation] = await Promise.all([
      data.meta_title ? translateJob({ title: data.meta_title, position: "", location: "", targetLang }) : Promise.resolve(undefined),
      data.meta_description ? translateJob({ title: data.meta_description, position: "", location: "", targetLang }) : Promise.resolve(undefined),
      data.content ? translateJob({ title: data.content, position: "", location: "", targetLang }) : Promise.resolve(undefined),
    ]);

    return {
      job_title: translation.title,
      job_position: translation.position,
      job_location: translation.location,
      job_benefits: translation.benefits,
      job_description: translation.description,
      job_requirements: translation.requirements,
      meta_title: metaTitleTranslation?.title,
      meta_description: metaDescTranslation?.title,
      content: contentTranslation?.title,
      slug: generateUniqueSlug(translation.title),
    };
  }

  async create(authorId: number, dto: CreateJobArticleDto) {
    // Tạo bản ghi tiếng Việt
    const jobArticle = await this.prisma.jobArticle.create({
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

    // Dịch và tạo bản tiếng Anh
    const enTranslation = await this.translateJobArticleData(dto, 'en');
    await this.prisma.jobArticleTranslation.create({
      data: {
        job_article_id: jobArticle.id,
        language: 'en',
        ...enTranslation,
      },
    });

    // Dịch và tạo bản tiếng Trung
    const zhTranslation = await this.translateJobArticleData(dto, 'zh');
    await this.prisma.jobArticleTranslation.create({
      data: {
        job_article_id: jobArticle.id,
        language: 'zh',
        ...zhTranslation,
      },
    });

    return this.findOne(jobArticle.id);
  }

  async update(id: number, dto: UpdateJobArticleDto) {
    const jobArticle = await this.prisma.jobArticle.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!jobArticle) {
      throw new Error('Job article not found');
    }

    // Cập nhật bản tiếng Việt
    const viTranslation = jobArticle.translations.find(t => t.language === 'vi');
    await this.prisma.jobArticle.update({
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

    // Dịch và cập nhật bản tiếng Anh
    const enTranslation = await this.translateJobArticleData(dto, 'en');
    const existingEnTranslation = jobArticle.translations.find(t => t.language === 'en');
    if (existingEnTranslation) {
      await this.prisma.jobArticleTranslation.update({
        where: { id: existingEnTranslation.id },
        data: enTranslation,
      });
    } else {
      await this.prisma.jobArticleTranslation.create({
        data: {
          job_article_id: id,
          language: 'en',
          ...enTranslation,
        },
      });
    }

    // Dịch và cập nhật bản tiếng Trung
    const zhTranslation = await this.translateJobArticleData(dto, 'zh');
    const existingZhTranslation = jobArticle.translations.find(t => t.language === 'zh');
    if (existingZhTranslation) {
      await this.prisma.jobArticleTranslation.update({
        where: { id: existingZhTranslation.id },
        data: zhTranslation,
      });
    } else {
      await this.prisma.jobArticleTranslation.create({
        data: {
          job_article_id: id,
          language: 'zh',
          ...zhTranslation,
        },
      });
    }

    return this.findOne(id);
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