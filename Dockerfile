# Get NPM packages
FROM node:14-alpine AS dependencies
WORKDIR /app
COPY package.json yarn.lock prisma prod.env ./
RUN npm install

# Rebuild the source code only when needed
FROM dependencies AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM builder AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --chown=nextjs:nodejs ./.next ./.next
# COPY ./node_modules ./node_modules
# COPY ./package.json ./package.json
# COPY ./prod.env ./.env
# COPY ./prisma ./prisma
RUN rm -rf ./node_modules
RUN chmod -R 777 ./prisma
RUN npm run db:push

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]
