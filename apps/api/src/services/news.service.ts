import { PrismaClient } from '@prisma/client';
import { CreateNewsDto, UpdateNewsDto } from '../DTOs/request/news.input';
import { translateNews } from '../utils/gemini-translate';
import { buildPaginationResult } from '../utils/pagination';

export class NewsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async translateNewsData(data: {
    title?: string;
    content?: string;
  }, targetLang: "en" | "zh") {
    if (!data.title || !data.content) {
      throw new Error('Title and content are required for translation');
    }

    const translation = await translateNews({
      title: data.title,
      content: data.content,
      targetLang,
    });

    return translation;
  }

  async create(authorId: number, dto: CreateNewsDto) {
    // Tạo bản ghi tiếng Việt
    const news = await this.prisma.news.create({
      data: {
        author_id: authorId,
        main_image: dto.main_image,
        category_id: dto.category_id,
        tag: dto.tag,
        NewsTranslation: {
          create: {
            language: 'vi',
            title: dto.title,
            content: dto.content,
          },
        },
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
          },
        },
        NewsCategory: {
          include: {
            translations: true,
          },
        },
        NewsTranslation: true,
      },
    });
    console.log(dto);
    // Dịch song song bản tiếng Anh và tiếng Trung
    const [enTranslation, zhTranslation] = await Promise.all([
      this.translateNewsData(dto, 'en'),
      this.translateNewsData(dto, 'zh')
    ]);

    console.log(enTranslation, zhTranslation);

    // Tạo song song các bản dịch
    await Promise.all([
      this.prisma.newsTranslation.create({
        data: {
          news_id: news.id,
          language: 'en', 
          title: enTranslation.title ,
          content: enTranslation.content,
        },
      }),
      this.prisma.newsTranslation.create({
        data: {
          news_id: news.id,
          language: 'zh',
          title: zhTranslation.title,
          content: zhTranslation.content,
        },
      })
    ]);

    return this.findOne(news.id);
  }

  async update(id: number, dto: UpdateNewsDto) {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: { NewsTranslation: true },
    });

    if (!news) {
      throw new Error('News not found');
    }

    // Cập nhật bản tiếng Việt
    const viTranslation = news.NewsTranslation.find(t => t.language === 'vi');
    await this.prisma.news.update({
      where: { id },
      data: {
        main_image: dto.main_image,
        category_id: dto.category_id,
        tag: dto.tag,
        NewsTranslation: {
          update: {
            where: { id: viTranslation?.id },
            data: {
              title: dto.title,
              content: dto.content,
            },
          },
        },
      },
    });

    // Dịch và cập nhật bản tiếng Anh
    const enTranslation = await this.translateNewsData(dto, 'en');
    const existingEnTranslation = news.NewsTranslation.find(t => t.language === 'en');
    if (existingEnTranslation) {
      await this.prisma.newsTranslation.update({
        where: { id: existingEnTranslation.id },
        data: enTranslation,
      });
    } else {
      await this.prisma.newsTranslation.create({
        data: {
          news_id: id,
          language: 'en',
          ...enTranslation,
        },
      });
    }

    // Dịch và cập nhật bản tiếng Trung
    const zhTranslation = await this.translateNewsData(dto, 'zh');
    const existingZhTranslation = news.NewsTranslation.find(t => t.language === 'zh');
    if (existingZhTranslation) {
      await this.prisma.newsTranslation.update({
        where: { id: existingZhTranslation.id },
        data: zhTranslation,
      });
    } else {
      await this.prisma.newsTranslation.create({
        data: {
          news_id: id,
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
    categoryId?: number;
    language?: string;
  }) {
    const {
      skip = 0,
      take = 10,
      page = 1,
      pageSize = 10,
      categoryId,
      language = 'vi',
    } = params;

    const whereFilter = {
      category_id: categoryId,
      NewsTranslation: {
        some: {
          language,
        },
      },
    } as const;

    const [data, total] = await Promise.all([
      this.prisma.news.findMany({
        skip,
        take,
        where: whereFilter,
        include: {
          User: {
            select: {
              id: true,
              username: true,
            },
          },
          NewsCategory: {
            include: {
              translations: {
                where: {
                  language,
                },
              },
            },
          },
          NewsTranslation: {
            where: {
              language,
            },
          },
        },
        orderBy: {
          published_at: 'desc',
        },
      }),
      this.prisma.news.count({ where: whereFilter }),
    ]);

    return buildPaginationResult(data, total, page, pageSize);
  }

  async findOne(id: number, language = 'vi') {
    return this.prisma.news.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            username: true,
          },
        },
        NewsCategory: {
          include: {
            translations: {
              where: {
                language,
              },
            },
          },
        },
        NewsTranslation: {
          select: {
            language: true,
            title: true,
            content: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.news.delete({
      where: { id },
    });
  }
} 