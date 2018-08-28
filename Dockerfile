FROM alpine:3.4

# Install nginx package and remove cache
RUN apk add --update nginx && rm -rf /var/cache/apk/*

# Copy basic files

EXPOSE 80
EXPOSE 443
VOLUME ["/usr/share/nginx/html"]

COPY ./nginx.non-root.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
