# ════════════════════════════════════════════════════════════════════════════
# Makefile for docs.zynomi.com (Docusaurus)
# ════════════════════════════════════════════════════════════════════════════
# Author: Senthilnathan Karuppaiah
# Date: December 2025
#
# DESCRIPTION:
#   This Makefile provides commands to manage the Zynomi documentation site
#   built with Docusaurus, including local development and Vercel deployment.
#
# QUICK START:
#   1. make setup          # Install dependencies
#   2. make dev            # Start development server
#
# VERCEL DEPLOYMENT:
#   First time: Run 'make vercel-link' to connect to your Vercel project
#   Deploy: make deploy-prod
#
# ════════════════════════════════════════════════════════════════════════════

.PHONY: help setup status dev build serve clear deploy deploy-prod vercel-link vercel-env-pull vercel-logs

# ────────────────────────────────────────────────────────────────────────────
# HELP TARGET (Default)
# ────────────────────────────────────────────────────────────────────────────

help:
	@echo "════════════════════════════════════════════════════════════════"
	@echo "  docs.zynomi.com (Docusaurus) - Commands"
	@echo "════════════════════════════════════════════════════════════════"
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "Setup Commands:"
	@echo "  make setup            - Install dependencies (bun install)"
	@echo "  make status           - Show current configuration"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start development server"
	@echo "  make build            - Build for production"
	@echo "  make serve            - Serve production build locally"
	@echo "  make clear            - Clear Docusaurus cache"
	@echo ""
	@echo "Vercel Deployment:"
	@echo "  make deploy           - Deploy to Vercel (preview)"
	@echo "  make deploy-prod      - Deploy to Vercel (production)"
	@echo "  make vercel-link      - Link to Vercel project"
	@echo "  make vercel-env-pull  - Pull env vars from Vercel"
	@echo "  make vercel-logs      - View deployment logs"
	@echo ""
	@echo "════════════════════════════════════════════════════════════════"

# ────────────────────────────────────────────────────────────────────────────
# SETUP TARGETS
# ────────────────────────────────────────────────────────────────────────────

setup:
	@echo "📦 Installing dependencies..."
	bun install
	@echo "✅ Dependencies installed successfully"

status:
	@echo "════════════════════════════════════════════════════════════════"
	@echo "  docs.zynomi.com - Current Configuration"
	@echo "════════════════════════════════════════════════════════════════"
	@echo ""
	@echo "📁 Environment:"
	@echo "  Node Version     : $$(node --version)"
	@echo "  Bun Version      : $$(bun --version)"
	@echo ""
	@echo "📦 Package Info:"
	@echo "  Name             : $$(jq -r '.name' package.json)"
	@echo "  Version          : $$(jq -r '.version' package.json)"
	@echo ""
	@echo "🚀 Vercel Configuration:"
	@if [ -f .vercel/project.json ]; then \
		echo "  Project ID       : $$(jq -r '.projectId' .vercel/project.json)"; \
		echo "  Org ID           : $$(jq -r '.orgId' .vercel/project.json)"; \
	else \
		echo "  Status           : Not linked (run 'make vercel-link')"; \
	fi
	@echo ""
	@echo "════════════════════════════════════════════════════════════════"

# ────────────────────────────────────────────────────────────────────────────
# DEVELOPMENT TARGETS
# ────────────────────────────────────────────────────────────────────────────

dev:
	@echo "🚀 Starting Docusaurus development server..."
	bun run start

build:
	@echo "🔨 Building for production..."
	bun run build
	@echo "✅ Build complete"

serve:
	@echo "🚀 Serving production build locally..."
	bun run serve

clear:
	@echo "🧹 Clearing Docusaurus cache..."
	bun run clear
	@echo "✅ Cache cleared"

# ────────────────────────────────────────────────────────────────────────────
# VERCEL DEPLOYMENT TARGETS
# ────────────────────────────────────────────────────────────────────────────

vercel-link:
	@echo "🔗 Linking to Vercel project..."
	vercel link
	@echo "✅ Project linked"

deploy:
	@echo "🚀 Deploying preview to Vercel..."
	@if [ ! -d .vercel ]; then \
		echo "❌ Run 'make vercel-link' first"; \
		exit 1; \
	fi
	vercel
	@echo "✅ Preview deployment complete"

deploy-prod:
	@echo "🚀 Deploying to production..."
	@if [ ! -d .vercel ]; then \
		echo "❌ Run 'make vercel-link' first"; \
		exit 1; \
	fi
	vercel --prod
	@echo "✅ Production deployment complete"

vercel-env-pull:
	@echo "📥 Pulling environment variables from Vercel..."
	vercel env pull .env.local
	@echo "✅ Environment variables saved"

vercel-logs:
	@echo "📜 Fetching deployment logs..."
	vercel logs
