import { PrismaClient, ImportExport } from '@prisma/client';
import { CreateContainerDto, UpdateContainerDto } from '../DTOs/request/container.input';
import { buildPaginationResult } from '../utils/pagination';

export class ContainerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(dto: CreateContainerDto) {
    return this.prisma.container.create({
      data: {
        weight: dto.weight,
        vehicleNumber: dto.vehicle_number,
        containerNumber: dto.container_number,
        customer: dto.customer,
        importExport: dto.import_export as ImportExport,
        shippingLine: dto.shipping_line,
        seal: dto.seal,
        serviceType: dto.service_type,
        yardInDate: dto.yard_in_date ? new Date(dto.yard_in_date) : undefined,
        yardOutDate: dto.yard_out_date ? new Date(dto.yard_out_date) : undefined,
        yardPosition: dto.yard_position,
        note: dto.note,
      },
    });
  }

  async update(id: number, dto: UpdateContainerDto) {
    return this.prisma.container.update({
      where: { id },
      data: {
        weight: dto.weight,
        vehicleNumber: dto.vehicle_number,
        containerNumber: dto.container_number,
        customer: dto.customer,
        importExport: dto.import_export as ImportExport,
        shippingLine: dto.shipping_line,
        seal: dto.seal,
        serviceType: dto.service_type,
        yardInDate: dto.yard_in_date ? new Date(dto.yard_in_date) : undefined,
        yardOutDate: dto.yard_out_date ? new Date(dto.yard_out_date) : undefined,
        yardPosition: dto.yard_position,
        note: dto.note,
      },
    });
  }

  async findAll(params?: {
    page?: number;
    pageSize?: number;
    skip?: number;
    take?: number;
    containerNumber?: string;
    customer?: string;
    vehicleNumber?: string;
  }) {
    const {
      skip = 0,
      take = 10,
      page = 1,
      pageSize = 10,
      containerNumber,
      customer,
      vehicleNumber,
    } = params || {};

    const whereFilter = {
      containerNumber: containerNumber ? { contains: containerNumber } : undefined,
      customer: customer ? { contains: customer } : undefined,
      vehicleNumber: vehicleNumber ? { contains: vehicleNumber } : undefined,
    } as const;

    const [data, total] = await Promise.all([
      this.prisma.container.findMany({
        skip,
        take,
        where: whereFilter,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.container.count({ where: whereFilter }),
    ]);

    return buildPaginationResult(data, total, page, pageSize);
  }

  async findOne(id: number) {
    return this.prisma.container.findUnique({ where: { id } });
  }

  async findByContainerNumber(containerNumber: string) {
    return this.prisma.container.findFirst({
      where: { containerNumber },
    });
  }

  async findByVehicleNumber(vehicleNumber: string) {
    return this.prisma.container.findFirst({
      where: { vehicleNumber },
    });
  }

  async delete(id: number) {
    return this.prisma.container.delete({ where: { id } });
  }
} 