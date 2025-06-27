@echo off
echo DATABASE_URL=postgresql://neondb_owner:npg_0PrdfMInuKe6@ep-flat-butterfly-a814z8r8-pooler.eastus2.azure.neon.tech/neondb?sslmode=require^&channel_binding=require > .env.local
echo NEXTAUTH_SECRET=alo17-secret-key-2025-very-secure-and-long >> .env.local
echo NEXTAUTH_URL=http://localhost:3004 >> .env.local
echo Environment variables created successfully!
pause 