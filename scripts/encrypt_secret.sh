echo "Encrypt Test"
gpg -o .env.test.gpg --symmetric --cipher-algo AES256 .env.test.local
echo "Encrypt UAT"
gpg -o .env.uat.gpg --symmetric --cipher-algo AES256 .env.uat.local
echo "Encrypt Production"
gpg -o .env.production.gpg --symmetric --cipher-algo AES256 .env.production.local
