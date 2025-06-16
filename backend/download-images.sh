#!/bin/bash

# Create directories if they don't exist
mkdir -p public/profiles public/badges

# Download profile images
echo "Downloading profile images..."

# Admin profile
curl -L "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" -o public/profiles/admin.png

# Employer profiles
curl -L "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg" -o public/profiles/employer.png
curl -L "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" -o public/profiles/startup.png

# Student profiles
curl -L "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" -o public/profiles/ram.png
curl -L "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" -o public/profiles/sita.png
curl -L "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" -o public/profiles/hari.png
curl -L "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" -o public/profiles/gita.png
curl -L "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" -o public/profiles/sanjay.png

# Download badge images
echo "Downloading badge images..."

# Badge images (using abstract images that represent different achievement levels)
curl -L "https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg" -o public/badges/guru.png
curl -L "https://images.pexels.com/photos/1939486/pexels-photo-1939486.jpeg" -o public/badges/siksha-sevi.png
curl -L "https://images.pexels.com/photos/1939487/pexels-photo-1939487.jpeg" -o public/badges/shiksharthi.png
curl -L "https://images.pexels.com/photos/1939488/pexels-photo-1939488.jpeg" -o public/badges/acharya.png
curl -L "https://images.pexels.com/photos/1939489/pexels-photo-1939489.jpeg" -o public/badges/utsaahi-intern.png

echo "All images downloaded successfully!" 