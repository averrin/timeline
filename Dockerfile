FROM alpine:3.4

# Install nginx package and remove cache
RUN apk add --update nginx && rm -rf /var/cache/apk/*

# Copy basic files
COPY nginx.non-root.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443
VOLUME ["/usr/share/nginx/html"]

# root user will run 'nginx: master process'
# nobody user will run 'nginx: worker process' as dictated in the nginx.non-root.conf
COPY . /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
