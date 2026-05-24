
#!/bin/bash

echo "🚀 Starting ComicsUnited repo restructuring..."

# Create new folder structure
mkdir -p src/components
mkdir -p src/styles
mkdir -p docs
mkdir -p tests

# Move JSX components
mv src/LandingPage.jsx src/components/ 2>/dev/null
mv src/Auth.jsx src/components/ 2>/dev/null
mv src/VenueSearch.jsx src/components/ 2>/dev/null
mv src/FeedbackModal.jsx src/components/ 2>/dev/null

# Move CSS files
mv src/LandingPage.css src/styles/ 2>/dev/null
mv src/Auth.css src/styles/ 2>/dev/null
mv src/VenueSearch.css src/styles/ 2>/dev/null
mv src/FeedbackModal.css src/styles/ 2>/dev/null
mv src/App.css src/styles/ 2>/dev/null

# Move documentation files
mv README-deploy.md docs/ 2>/dev/null
mv SECURITY-CONFIG.md docs/ 2>/dev/null
mv PERMALINK-GUIDE.md docs/ 2>/dev/null
mv BETA-TESTING-GUIDE.md docs/ 2>/dev/null

# Delete unnecessary files
rm -f "Attached HTML and CSS Context.txt"
rm -f venues_backup.json
rm -f index.html

# Stage and commit
git add .
git commit -m "Automated restructure: components, styles, docs, cleanup"

echo "🎉 Restructure complete! Push with: git push"

