import { PrismaService } from "src/prisma/prisma.service";

interface AsociarMarcasParams {
  prisma: PrismaService;
  lineaId: string;
  marcaIds: string[];
}

export async function asociarMarcas({ prisma, lineaId, marcaIds }: AsociarMarcasParams) {
  await prisma.marcaXLinea.deleteMany({
    where: { lineaId },
  }).then(() => {
    const marcaXLineaData = marcaIds.map((marcaId) => ({
      lineaId,
      marcaId,
    }));
    return prisma.marcaXLinea.createMany({
      data: marcaXLineaData,
    });
  });
}