# Get NPM packages
FROM node:16-alpine AS dependencies
ARG GEOLITE2_LICENSE_KEY
ARG NEXT_PUBLIC_SHORT_DOMAIN
RUN ECHO "NEXT_PUBLIC_SHORT_DOMAIN=$NEXT_PUBLIC_SHORT_DOMAIN"
WORKDIR /app
COPY package.json yarn.lock prisma .env scripts/update_ip_db.sh ./
RUN npm install
# Update IP Database
# ENV GEOLITE2_LICENSE_KEY ${GEOLITE2_LICENSE_KEY}
# RUN ./update_ip_db.sh

# Rebuild the source code only when needed
FROM dependencies AS builder
WORKDIR /app
COPY . .
RUN npm run build
# COPY ./prod.env ./.env
# RUN npm run db:push
RUN chmod -R 777 ./prisma

# Production image, copy all the files and run next
FROM builder AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_PUBLIC_SHORT_DOMAIN $NEXT_PUBLIC_SHORT_DOMAIN

# RUN addgroup -g 1007 -S nodejs
# RUN adduser -S nextjs -u 1007

# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/prod.db ./prisma

# USER nextjs
EXPOSE 3000
RUN node -v

CMD ["npm", "start"]
