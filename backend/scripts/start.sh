#!/usr/bin/env sh

yarn
npx prisma generate
yarn run start:dev
