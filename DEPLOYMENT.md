# Dokploy VPS Deployment Guide

## Overview

This guide explains how to deploy the AI Business Receptionist on a VPS using Dokploy, a self-hosted PaaS alternative to Vercel/Netlify/Heroku.

## Prerequisites

### VPS Requirements
- **Minimum**: 2GB RAM, 30GB disk space, 1 vCPU
- **Recommended**: 4GB RAM, 50GB disk space, 2 vCPU
- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **Docker**: Will be installed automatically by Dokploy

### Dokploy Installation

1. **Install Dokploy on your VPS**:
   ```bash
   curl -sSL https://dokploy.com/install.sh | sh
   ```

2. **Access Dokploy Dashboard**:
   - Open `http://your-server-ip:3000` in your browser
   - Complete the initial setup wizard

## Deployment Steps

### 1. Repository Setup

Ensure your repository is accessible (GitHub, GitLab, Bitbucket):
- Repository URL: `https://github.com/your-username/your-repo.git`
- Branch: `main` (or your preferred branch)

### 2. Create New Application in Dokploy

1. **Create New Service**:
   - Go to Dokploy Dashboard
   - Click "Create Application"
   - Choose "Docker Compose"

2. **Configure Repository**:
   - **Repository URL**: Your Git repository URL
   - **Branch**: `main`
   - **Compose Path**: `./docker-compose.yml`

### 3. Environment Variables

Set the following environment variables in Dokploy:

#### Required Variables
```env
NODE_ENV=production
VITE_DEFAULT_BUSINESS=demo
DOMAIN=your-domain.com
```

#### Optional Variables
```env
VITE_API_URL=https://api.your-domain.com
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_ANALYTICS_ID=your-analytics-id
```

### 4. Domain Configuration

1. **Add Domain in Dokploy**:
   - Go to your application settings
   - Add your domain (e.g., `receptionist.your-domain.com`)
   - Enable SSL/TLS certificate (Let's Encrypt)

2. **DNS Configuration**:
   ```
   Type: A Record
   Name: receptionist (or @ for root domain)
   Value: your-server-ip
   ```

### 5. Deploy Application

1. **Initial Deployment**:
   - Click "Deploy" in Dokploy dashboard
   - Monitor build logs for any errors
   - Wait for deployment to complete

2. **Verify Deployment**:
   - Access your domain: `https://receptionist.your-domain.com`
   - Test different business configurations:
     - `https://receptionist.your-domain.com?business=demo`
     - `https://receptionist.your-domain.com?business=healthplus`

## Business Configuration

### URL-Based Business Loading

The application supports multiple ways to specify which business configuration to load:

1. **Query Parameter** (Recommended for embedding):
   ```
   https://your-domain.com?business=dentist-office
   ```

2. **URL Path**:
   ```
   https://your-domain.com/dentist-office
   ```

3. **Environment Default**:
   ```env
   VITE_DEFAULT_BUSINESS=your-default-business
   ```

### Adding New Businesses

#### Method 1: Static Configuration
Add to `src/data/businesses.json`:
```json
{
  "id": "your-business-id",
  "name": "Your Business Name",
  "description": "Business description",
  "branding": {
    "primaryColor": "#your-color",
    "secondaryColor": "#your-secondary-color"
  },
  "content": [...],
  "knowledgeBase": [...],
  "settings": {...}
}
```

#### Method 2: External API (Future)
Configure `VITE_API_URL` to load business configurations dynamically.

## Website Embedding

### Iframe Embedding
```html
<iframe 
  src="https://your-domain.com?business=your-business-id"
  width="400"
  height="600"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
  allow="microphone">
</iframe>
```

### Responsive Embedding
```html
<div style="position: relative; width: 100%; max-width: 400px; height: 600px;">
  <iframe 
    src="https://your-domain.com?business=your-business-id"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allow="microphone">
  </iframe>
</div>
```

## Monitoring and Maintenance

### Application Logs
```bash
# SSH into your VPS
docker logs quantum-receptionist

# Follow logs in real-time
docker logs -f quantum-receptionist
```

### Health Check
```bash
curl https://your-domain.com/health
```

### Updates and Redeploys
1. Push changes to your Git repository
2. In Dokploy dashboard, click "Deploy" to rebuild and redeploy
3. Or set up webhook for automatic deployments

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version in Dockerfile
   - Verify all dependencies in package.json
   - Review build logs in Dokploy

2. **Network Issues**:
   - Ensure ports 80/443 are open on your VPS
   - Check domain DNS propagation
   - Verify SSL certificate generation

3. **Business Not Loading**:
   - Check business ID in URL parameters
   - Verify business exists in businesses.json
   - Check browser console for errors

### Performance Optimization

1. **CDN Integration**:
   - Use Cloudflare or similar CDN
   - Configure caching rules for static assets

2. **Database Optimization** (Future):
   - Add PostgreSQL for business configurations
   - Implement Redis for caching

3. **Horizontal Scaling**:
   - Use Dokploy's multi-server deployment
   - Configure load balancing

## Security Considerations

1. **SSL/TLS**: Always use HTTPS in production
2. **Environment Variables**: Never commit sensitive data to repository
3. **CORS**: Configure appropriate CORS headers for embedding
4. **Rate Limiting**: Implement rate limiting for API calls (future)

## Support

For deployment issues:
1. Check Dokploy documentation: https://docs.dokploy.com
2. Review application logs for specific errors
3. Test locally with Docker Compose first

For application-specific issues:
1. Check the application logs
2. Verify business configuration format
3. Test with demo business first