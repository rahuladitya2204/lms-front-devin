#!/bin/bash

echo "Starting post-deployment cleanup..."

# Clean up log files if any
echo "Cleaning up old log files..."
rm -rf /home/LogFiles/*.log
rm -rf /home/LogFiles/*.gz
rm -rf /home/LogFiles/*.[0-9]

# Remove old temporary files
echo "Cleaning up temporary files..."
rm -rf /home/temp/*

# Clean up node_modules (no longer needed after build)
echo "Cleaning up node_modules folder..."
rm -rf /home/site/wwwroot/node_modules

# Clean up build cache (if you're using a build tool like Next.js)
echo "Cleaning up build cache..."
rm -rf /home/site/wwwroot/.next/cache/*

# Clean up old build artifacts if not required anymore
echo "Removing old deployment files if necessary..."
rm -rf /home/site/wwwroot/old-version/*

# Optionally, clean up other files in the app's directory if needed
# Example: Remove unneeded files after build
echo "Cleaning up unneeded files..."
rm -rf /home/site/wwwroot/.env
rm -rf /home/site/wwwroot/.git
rm -rf /home/site/wwwroot/test  # If test files are present and not required

echo "Post-deployment cleanup completed."
