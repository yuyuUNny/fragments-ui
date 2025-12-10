# Use node version 23.9.0
#FROM node:23.9.0
FROM node:23-alpine AS build

# Use /app as working directory
WORKDIR /app

#Copy the package.json and package-lock.json
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY . .

# Build Parcel output → dist/
RUN rm -rf .parcel-cache dist && npm run build

# Serve with nginx
FROM nginx:alpine

# Copy build output to nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]