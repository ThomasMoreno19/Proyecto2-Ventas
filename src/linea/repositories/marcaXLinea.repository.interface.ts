export interface IMarcaXLineaRepository {
  createMany(data: { marcaId: string; lineaId: string }[]): Promise<void>;
}
