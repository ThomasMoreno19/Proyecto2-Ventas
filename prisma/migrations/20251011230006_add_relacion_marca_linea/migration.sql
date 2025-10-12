-- CreateTable
CREATE TABLE "Linea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "_LineaToMarca" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LineaToMarca_A_fkey" FOREIGN KEY ("A") REFERENCES "Linea" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LineaToMarca_B_fkey" FOREIGN KEY ("B") REFERENCES "Marca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_LineaToMarca_AB_unique" ON "_LineaToMarca"("A", "B");

-- CreateIndex
CREATE INDEX "_LineaToMarca_B_index" ON "_LineaToMarca"("B");
