echo "Encrypt Test"
gpg --symmetric --cipher-algo AES256 .env.test
echo "Encrypt UAT"
gpg --symmetric --cipher-algo AES256 .env.uat
echo "Encrypt Production"
gpg --symmetric --cipher-algo AES256 .env.production
