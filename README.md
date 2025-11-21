Streaming radio Andgopink Navidrome  


# Navichat Radio - Deployment Guide

A complete guide to installing and running Navichat Radio on your own VPS or hosting server.

## Prerequisites

Before you begin, ensure your server has:

- **Node.js** 18.x or higher
- **PostgreSQL** 13 or higher
- **Git**
- **npm** or **yarn** package manager
- **sudo** access for system-level installation

### Installation on Ubuntu/Debian

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (18.x LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Git
sudo apt install -y git
```

### Installation on CentOS/RHEL

```bash
# Update system packages
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PostgreSQL
sudo yum install -y postgresql-server postgresql-contrib

# Initialize and start PostgreSQL
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Git
sudo yum install -y git
```

## Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd /var/www

# Clone your GitHub repository
git clone https://github.com/Andgopink/radio1.git navichat-radio
cd navichat-radio
```

## Step 2: Set Up PostgreSQL Database

```bash
# Switch to PostgreSQL user
sudo -u postgres psql

# Create database and user
CREATE DATABASE navichat_radio;
CREATE USER navichat WITH PASSWORD 'your_secure_password_here';
ALTER ROLE navichat SET client_encoding TO 'utf8';
ALTER ROLE navichat SET default_transaction_isolation TO 'read committed';
ALTER ROLE navichat SET default_transaction_deferrable TO on;
ALTER ROLE navichat SET default_transaction_read_uncommitted TO off;
GRANT ALL PRIVILEGES ON DATABASE navichat_radio TO navichat;
\q
```

**Note:** Replace `'your_secure_password_here'` with a strong, random password.

## Step 3: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Build the frontend
npm run build
```

## Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL="postgresql://navichat:your_secure_password_here@localhost:5432/navichat_radio"
PGHOST="localhost"
PGPORT="5432"
PGUSER="navichat"
PGPASSWORD="your_secure_password_here"
PGDATABASE="navichat_radio"

# Application Settings
NODE_ENV="production"
PORT=3000

# Navidrome Server Configuration (Optional - configure via Admin Panel)
# NAVIDROME_URL="http://your-navidrome-server:4533"
# NAVIDROME_USERNAME="your_navidrome_username"
```

## Step 5: Run Database Migrations

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
```

## Step 6: Start the Application

### Option A: Direct Start (Development/Testing)

```bash
# Start the production build
npm run start
```

The application will be available at `http://localhost:3000`

### Option B: Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'navichat-radio',
    script: './dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Set PM2 to auto-restart on server reboot
pm2 startup
pm2 save
```

## Step 7: Set Up Reverse Proxy (Nginx)

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/navichat-radio
```

Add the following configuration:

```nginx
upstream navichat_app {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (optional, recommended)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (see Step 8)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_vary on;

    # Reverse proxy configuration
    location / {
        proxy_pass http://navichat_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support for chat
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/navichat-radio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: SSL/HTTPS Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (should be automatic with certbot)
sudo systemctl enable certbot.timer
```

## Step 9: Configure Navidrome Server

Access your application at `https://yourdomain.com` and:

1. Navigate to `/login` (or use `/admin` if already configured)
2. Enter your admin credentials (default: `admin` / `admin`)
3. Go to the Admin Panel
4. Configure your Navidrome server details:
   - **Navidrome URL**: `http://your-navidrome-server:4533`
   - **Username**: Your Navidrome username
   - Click "Test Connection" to verify

## Step 10: Firewall Configuration

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## Monitoring and Maintenance

### Check Application Status (with PM2)

```bash
# View running processes
pm2 status

# View logs
pm2 logs navichat-radio

# Restart application
pm2 restart navichat-radio

# Stop application
pm2 stop navichat-radio
```

### Database Backups

```bash
# Create a database backup
sudo -u postgres pg_dump navichat_radio > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
sudo -u postgres psql navichat_radio < backup_20240101_120000.sql
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Rebuild frontend
npm run build

# Restart application
pm2 restart navichat-radio
```

## Troubleshooting

### Application won't start

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check PostgreSQL connection
sudo -u postgres psql -c "SELECT version();"

# View application logs
tail -f logs/error.log
```

### Database connection errors

```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
psql "postgresql://navichat:password@localhost:5432/navichat_radio"
```

### Nginx proxy errors

```bash
# Check Nginx configuration
sudo nginx -t

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Port already in use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

## Performance Optimization

### Enable Caching Headers (in Nginx)

Add to your Nginx `location /` block:

```nginx
# Cache static assets for 1 month
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# Don't cache HTML files
location ~* \.html?$ {
    expires -1;
    add_header Cache-Control "no-cache, must-revalidate";
}
```

### Database Query Optimization

PostgreSQL is already optimized for this application. Monitor performance:

```bash
# Connect to PostgreSQL
sudo -u postgres psql navichat_radio

# View slow queries
SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

## Security Hardening

### 1. Disable SSH Password Authentication

Edit `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config

# Add or modify these lines:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart sshd
```

### 2. Keep System Updated

```bash
# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Set Up Fail2Ban

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Start and enable service
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

## Support & Documentation

- **GitHub Repository**: https://github.com/Andgopink/radio1
- **Navidrome Documentation**: https://www.navidrome.org/docs/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

Your Navichat Radio instance is now deployed and ready to stream music! 🎵
