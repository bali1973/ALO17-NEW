-- CreateTable
CREATE TABLE "OAuthSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "teamId" TEXT,
    "keyId" TEXT,
    "scope" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthSettings_provider_key" ON "OAuthSettings"("provider");
