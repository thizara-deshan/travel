# SSL Certificate Setup

This directory should contain your SSL certificates for https://thizara.dev

## Required Files:

- `fullchain.pem` - The full certificate chain
- `privkey.pem` - The private key

## Options for obtaining SSL certificates:

### Option 1: Let's Encrypt (Recommended for production)

You can use Certbot to obtain free SSL certificates:

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Obtain certificate (you'll need to verify domain ownership)
sudo certbot certonly --standalone -d thizara.dev -d www.thizara.dev

# Copy certificates to this directory
sudo cp /etc/letsencrypt/live/thizara.dev/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/thizara.dev/privkey.pem ./ssl/
```

### Option 2: Self-signed certificates (For development/testing)

```bash
# Generate self-signed certificate (for testing only)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/privkey.pem \
    -out ssl/fullchain.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=thizara.dev"
```

### Option 3: CloudFlare Origin Certificates

If you're using CloudFlare, you can generate origin certificates from the CloudFlare dashboard.

## Important Notes:

- Make sure the certificate files have appropriate permissions (readable by nginx container)
- For production, use certificates from a trusted CA like Let's Encrypt
- Self-signed certificates will show security warnings in browsers
- Remember to renew certificates before they expire

## File Permissions:

The certificate files should be readable by the nginx container. If you encounter permission issues, you may need to adjust file ownership or permissions.
