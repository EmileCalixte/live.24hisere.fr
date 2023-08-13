#!/usr/bin/env sh

npm install --verbose
npx prisma generate
npm run start:dev
