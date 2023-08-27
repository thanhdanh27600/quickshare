echo "Prepare for short building"
echo "Removing API"
rm -rf ./src/pages/api
echo "Removing Stats page"
rm -rf ./src/pages/v
echo "Removing Screen"
rm -rf ./src/components/screens/URLTracking
rm -f ./src/components/screens/URLShortener.tsx
mv ./src/components/screens/URLShortenerNull.tsx ./src/components/screens/URLShortener.tsx
echo "Removing Section"
rm -rf ./src/components/sections
