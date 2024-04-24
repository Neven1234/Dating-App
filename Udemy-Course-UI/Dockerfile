# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:lts-alpine AS build

# Set the working directory
WORKDIR /app


# Add the source code to app
COPY . .
 
RUN npm install
# Generate the build of the application
RUN npm run build:prod -- --output-path=dist/udemy-course-ui


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/udemy-course-ui/browser/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80
CMD ["nginx","-g","daemon off;"]