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
