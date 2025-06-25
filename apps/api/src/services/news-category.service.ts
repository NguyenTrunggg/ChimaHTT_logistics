import { PrismaClient } from '@prisma/client';
import { CreateNewsCategoryDto, UpdateNewsCategoryDto } from '../DTOs/request/news-category.input';

export class NewsCategoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(dto: CreateNewsCategoryDto) {
    return this.prisma.newsCategory.create({
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

    return this.prisma.newsCategory.update({
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