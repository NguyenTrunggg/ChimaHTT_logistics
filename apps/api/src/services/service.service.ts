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

    // Dịch và tạo bản tiếng Anh
    const enTranslation = await this.translateServiceData(dto, 'en');
    await this.prisma.serviceTranslation.create({
      data: {
        service_id: service.id,
        language: 'en',
        ...enTranslation,
      },
    });

    // Dịch và tạo bản tiếng Trung
    const zhTranslation = await this.translateServiceData(dto, 'zh');
    await this.prisma.serviceTranslation.create({
      data: {
        service_id: service.id,
        language: 'zh',
        ...zhTranslation,
      },
    });

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

    // Dịch và cập nhật bản tiếng Anh
    const enTranslation = await this.translateServiceData(dto, 'en');
    const existingEnTranslation = service.ServiceTranslation.find(t => t.language === 'en');
    if (existingEnTranslation) {
      await this.prisma.serviceTranslation.update({
        where: { id: existingEnTranslation.id },
        data: enTranslation,
      });
    } else {
      await this.prisma.serviceTranslation.create({
        data: {
          service_id: id,
          language: 'en',
          ...enTranslation,
        },
      });
    }

    // Dịch và cập nhật bản tiếng Trung
    const zhTranslation = await this.translateServiceData(dto, 'zh');
    const existingZhTranslation = service.ServiceTranslation.find(t => t.language === 'zh');
    if (existingZhTranslation) {
      await this.prisma.serviceTranslation.update({
        where: { id: existingZhTranslation.id },
        data: zhTranslation,
      });
    } else {
      await this.prisma.serviceTranslation.create({
        data: {
          service_id: id,
          language: 'zh',
          ...zhTranslation,
        },
      });
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