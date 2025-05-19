FROM node:alpine

# Install serve globally
RUN npm install -g serve

# Copy dist folder
COPY ./dist /dist

WORKDIR /dist

EXPOSE 3000

# Start the static server on port 3000
CMD ["serve", "-s", ".", "-l", "3000"]