# GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

## How it works

1. **GitHub Actions Workflow**: `.github/workflows/deploy.yml` handles the deployment
2. **Automatic Build**: The workflow builds the project using `npm run build`
3. **Deploy to Pages**: The built files are automatically deployed to GitHub Pages

## Deployment URL

Once deployed, your application will be available at:
`https://jay-ulomi.github.io/Micro-finance/`

## Manual Deployment

If you need to trigger a manual deployment:

1. Go to your repository on GitHub
2. Navigate to **Actions** tab
3. Select the **Deploy to GitHub Pages** workflow
4. Click **Run workflow**

## Local Testing

To test the build locally before deployment:

```bash
npm run build
npm run preview
```

## Configuration

- **Base Path**: Set to `/Micro-finance/` in `vite.config.ts`
- **Build Output**: Files are built to the `dist/` directory
- **Branch**: Deploys from the `main` branch

## Troubleshooting

If deployment fails:

1. Check the **Actions** tab for error logs
2. Ensure all dependencies are properly installed
3. Verify the build completes successfully locally
