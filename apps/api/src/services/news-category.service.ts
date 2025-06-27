import { PrismaClient } from '@prisma/client';
import { CreateNewsCategoryDto, UpdateNewsCategoryDto } from '../DTOs/request/news-category.input';
import { translateService } from '../utils/gemini-translate';

export class NewsCategoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async translateServiceData(data: {
    name?: string;
  }, targetLang: "en" | "zh") {
    if (!data.name) {
      throw new Error('Name is required for translation');
    }
    const translation = await translateService({
      title: data.name,
      content: '',
      features: {},
      targetLang,
    });
    return {
      name: translation.title,
    };
  }

  async create(dto: CreateNewsCategoryDto) {
    const newsCategory = await this.prisma.newsCategory.create({
      data: {
        translations: {
          create: {
            language: 'vi',
            name: dto.name,
          },
        },
      },
      include: {
        translations: true,
      },
    });
    const languages: ("en" | "zh")[] = ["en", "zh"];

      // Run translation for all languages concurrently
      const translationResults = await Promise.allSettled(
        languages.map((lang) => this.translateServiceData(dto, lang))
      );

      // Create translations for all languages
      await Promise.all(
        languages.map((lang, index) => {
          const translation = translationResults[index].status === 'fulfilled' ? translationResults[index].value : null;
          return this.prisma.newsCategoryTranslation.create({
            data: {
              news_category_id: newsCategory.id,
              language: lang,
              name: translation?.name || '',
            },
          });
        })
      );

      return this.findOne(newsCategory.id);
  }

  async update(id: number, dto: UpdateNewsCategoryDto) {
    const category = await this.prisma.newsCategory.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!category) {
      throw new Error('News category not found');
    }

    const viTranslation = category.translations.find(t => t.language === 'vi');

    const updatedCategory = await this.prisma.newsCategory.update({
      where: { id },
      data: {
        translations: {
          update: {
            where: { id: viTranslation?.id },
            data: {
              name: dto.name,
            },
          },
        },
      },
      include: {
        translations: true,
      },
    });
    const languages: ("en" | "zh")[] = ["en", "zh"];

    // Run translation for all languages concurrently
    const translationResults = await Promise.allSettled(
      languages.map((lang) => this.translateServiceData(dto, lang))
    );
    
    await Promise.all(
      languages.map((lang, index) => {
        const translation = translationResults[index].status === 'fulfilled' ? translationResults[index].value : null;
        return this.prisma.newsCategoryTranslation.update({
          where: { id: viTranslation?.id },
          data: {
            name: translation?.name || '',
          },
        });
      })
    );

    return this.findOne(updatedCategory.id);
  }

  async findAll(language = 'vi') {
    return this.prisma.newsCategory.findMany({
      include: {
        translations: {
          where: {
            language,
          },
        },
      },
    });
  }

  async findOne(id: number, language = 'vi') {
    return this.prisma.newsCategory.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            language,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.newsCategory.delete({
      where: { id },
    });
  }
} 