import { PrismaClient } from '@prisma/client';
import { CreateServiceDto, UpdateServiceDto } from '../DTOs/request/service.input';
import { translateService } from '../utils/gemini-translate';
import { Prisma } from '@prisma/client';
import { buildPaginationResult } from '../utils/pagination';

export class ServiceService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async translateServiceData(data: {
    title?: string;
    content?: string;
    features?: Record<string, any>;
  }, targetLang: "en" | "zh") {
    if (!data.title || !data.content) {
      throw new Error('Title and content are required for translation');
    }

    const translation = await translateService({
      title: data.title,
      content: data.content,
      features: data.features,
      targetLang,
    });

    return {
      title: translation.title,
      content: translation.content,
      features: translation.features ?? Prisma.JsonNull,
    };
  }

  async create(dto: CreateServiceDto) {
    // Tạo bản ghi tiếng Việt
    const service = await this.prisma.service.create({
      data: {
        main_image: dto.main_image,
        ServiceTranslation: {
          create: {
            language: 'vi',
            title: dto.title,
            content: dto.content,
            features: dto.features,
          },
        },
      },
      include: {
        ServiceTranslation: true,
      },
    });

    try {
      const languages: ("en" | "zh")[] = ["en", "zh"];

      // Run translation for all languages concurrently
      const translationResults = await Promise.allSettled(
        languages.map((lang) => this.translateServiceData(dto, lang))
      );

      // Persist only successful translations
      await Promise.all(
        translationResults.map((result, index) => {
          if (result.status === "fulfilled") {
            const lang = languages[index];
            return this.prisma.serviceTranslation.create({
              data: {
                service_id: service.id,
                language: lang,
                ...result.value,
              },
            });
          }
          console.warn(`Translation failed for language ${languages[index]}:`, result.reason);
          return Promise.resolve();
        })
      );

      console.log("Successfully created service with available translations");
    } catch (translationError) {
      console.warn('Translation processing encountered errors, but Vietnamese version was created successfully:', translationError);
      // Vietnamese record already exists; nothing else to do
    }

    return this.findOne(service.id);
  }

  async update(id: number, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { ServiceTranslation: true },
    });

    if (!service) {
      throw new Error('Service not found');
    }

    // Cập nhật bản tiếng Việt
    const viTranslation = service.ServiceTranslation.find(t => t.language === 'vi');
    await this.prisma.service.update({
      where: { id },
      data: {
        main_image: dto.main_image,
        ServiceTranslation: {
          update: {
            where: { id: viTranslation?.id },
            data: {
              title: dto.title,
              content: dto.content,
              features: dto.features,
            },
          },
        },
      },
    });

    try {
      const languages: ("en" | "zh")[] = ["en", "zh"];

      // Translate all languages concurrently
      const translationResults = await Promise.allSettled(
        languages.map((lang) => this.translateServiceData(dto, lang))
      );

      await Promise.all(
        translationResults.map((result, index) => {
          const lang = languages[index];
          const existingTranslation = service.ServiceTranslation.find((t) => t.language === lang);

          if (result.status === "fulfilled") {
            if (existingTranslation) {
              return this.prisma.serviceTranslation.update({
                where: { id: existingTranslation.id },
                data: result.value,
              });
            }
            return this.prisma.serviceTranslation.create({
              data: {
                service_id: id,
                language: lang,
                ...result.value,
              },
            });
          }

          console.warn(`Translation failed for language ${lang}:`, result.reason);
          return Promise.resolve();
        })
      );

      console.log('Successfully updated service with available translations');
    } catch (translationError) {
      console.warn('Translation processing encountered errors during update, but Vietnamese version was updated successfully:', translationError);
      // Continue without updating translations
    }

    return this.findOne(id);
  }

  async findAll(language = 'vi', params?: {
    page?: number;
    pageSize?: number;
    skip?: number;
    take?: number;
  }) {
    const {
      skip = 0,
      take = 10,
      page = 1,
      pageSize = 10,
    } = params || {};

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        skip,
        take,
        include: {
          ServiceTranslation: {
            where: {
              language,
            },
          },
        },
      }),
      this.prisma.service.count(),
    ]);

    return buildPaginationResult(data, total, page, pageSize);
  }

  async findOne(id: number, language = 'vi') {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        ServiceTranslation: {
          where: {
            language,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
} 