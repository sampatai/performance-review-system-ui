# 🔹 Step 1: Build Angular App using Node
FROM node:20.12.2-alpine AS builder

 # Set working directory in container
WORKDIR /app    
 # Copy dependency files                  
COPY package*.json ./   
 # Install dependencies          
RUN npm ci  
# Copy rest of the app                      
COPY . .   
# Build Angular app                        
RUN npm run build -- --configuration production   

# 🔹 Step 2: Use Nginx to serve built files
FROM nginx:alpine

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output to Nginx's serving folder
COPY --from=builder /app/dist/performance-review-ui/browser /usr/share/nginx/html

# Add our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]


#Stage 1 (builder): Uses Node.js to install dependencies and build your Angular app for production. The output is placed in /app/dist/performance-review-ui/browser.
#Stage 2 (Nginx): Uses a lightweight Nginx image. It removes the default web files, copies your built Angular app into the Nginx web root, and applies your custom Nginx config (which is essential for Angular routing and static asset caching).
#EXPOSE 8081: Makes port 8081 available for Docker to map to your host.
#CMD: Runs Nginx in the foreground so the container stays alive.