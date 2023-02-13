#!/bin/sh

echo 'Updating IP Database...'
GEOLITE2_LICENSE_KEY=${{ secrets.GEOLITE2_LICENSE_KEY }} node ./node_modules/geoip-country/scripts/updatedb.js
