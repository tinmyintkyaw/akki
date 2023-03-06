-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "ydoc" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_documentName_key" ON "Document"("documentName");

-- CreateIndex
CREATE UNIQUE INDEX "Document_accountId_documentName_key" ON "Document"("accountId", "documentName");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
