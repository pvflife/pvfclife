# Name the node stage "builder"
FROM node:14.18.3 as builder
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN yarn install && npx browserslist@latest --update-db && yarn build
# nginx state for serving content
FROM nginx
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html
# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]