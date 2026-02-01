# Trade Tracker - Deployment Guide

## ✅ Setup Complete

Your app now has:
- ✅ Import/Export functionality for data backup
- ✅ Flexible deployment for GitHub Pages OR custom domain
- ✅ GitHub Actions workflow for automatic deployment

## 📦 Deployment Options

### Option 1: GitHub Pages (username.github.io/trade-tracker)

**Configuration:**
- ✅ Already configured (default)
- Base path: `/trade-tracker/`
- URL: `https://i2gucci.github.io/trade-tracker/`

**Steps:**
1. Push to GitHub
2. Go to repo Settings → Pages
3. Source: **GitHub Actions**
4. Done! Auto-deploys on every push to `main`

### Option 2: Custom Domain (e.g., trades.yourdomain.com)

**Configuration needed:**
1. Update `.github/workflows/deploy.yml` line 27:
   ```yaml
   VITE_BASE_PATH: /  # Changed from /trade-tracker/
   ```

2. Or use npm script:
   ```bash
   npm run build:custom-domain
   ```

**Setup custom domain:**
1. Go to repo Settings → Pages
2. Custom domain: `trades.yourdomain.com`
3. Add CNAME record in your DNS:
   ```
   CNAME  trades  i2gucci.github.io
   ```
4. Wait for DNS propagation (5-30 minutes)
5. Enable "Enforce HTTPS" in GitHub Pages settings

### Option 3: Different Repository Name

**If you rename the repo:**
1. Update `.github/workflows/deploy.yml` line 27:
   ```yaml
   VITE_BASE_PATH: /NEW-REPO-NAME/
   ```

2. Or use environment variable locally:
   ```bash
   VITE_BASE_PATH=/NEW-REPO-NAME/ npm run build
   ```

## 🚀 Quick Deploy

**Using GitHub Actions (Recommended):**
```bash
git add .
git commit -m "Deploy"
git push
```

**Manual deploy with gh-pages package:**
```bash
npm run deploy
```

## 🔄 Switching Between Deployments

**Current setup (repo subdirectory):**
- URL: `https://i2gucci.github.io/trade-tracker/`
- No changes needed

**Switching to custom domain:**
1. Edit `.github/workflows/deploy.yml`
2. Change `VITE_BASE_PATH: /trade-tracker/` to `VITE_BASE_PATH: /`
3. Add custom domain in GitHub Pages settings
4. Configure DNS CNAME record

**Switching to root of GitHub Pages:**
1. Edit `.github/workflows/deploy.yml`
2. Change `VITE_BASE_PATH: /trade-tracker/` to `VITE_BASE_PATH: /`
3. Rename repo to `i2gucci.github.io`
4. URL becomes: `https://i2gucci.github.io/`

## 📝 Important Notes
- **Regular backups**: Click Export before making major changes
- **Transfer devices**: Export on one device, import on another
- **Data format**: Standard JSON - readable and portable
- **Privacy**: All data stays in your browser or backup files

### Troubleshooting
- **404 on deployment**: Check base path in vite.config.ts matches repo name
- **Blank page**: Check browser console for asset loading errors
- **Import fails**: Ensure JSON file is from a valid export

## 🔄 Workflow

**For users:**
1. Use app → trades saved to localStorage
2. Export regularly for backups
3. Import to restore or transfer to new device/browser

**For deployment:**
```bash
# Make changes
npm run dev

# Test locally
npm run build
npm run preview

# Deploy
npm run deploy
# OR just push to GitHub (if using Actions)
```

## 📱 Accessing Your App

Once deployed:
- **Public URL**: `https://YOUR-USERNAME.github.io/trade-tracker/`
- **Share with others**: They get their own private data (localStorage)
- **Multiple devices**: Use export/import to sync manually

## 🎯 Next Steps

1. Deploy and test
2. Share URL with potential users
3. Gather feedback
4. Consider backend (Supabase/Firebase) if cloud sync is needed later
