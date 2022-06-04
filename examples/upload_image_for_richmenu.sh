source .env.dev

if [ "$lineNPBToken" = "" ];then
  echo "Please set lineNPBToken in .env.dev"
  exit 1
fi

if [ "$richMenuId" = "" ];then
  echo "Please set richMenuId in .env.dev"
  exit 1
fi

curl -v -X POST https://api-data.line.me/v2/bot/richmenu/$richMenuId/content \
-H "Authorization: Bearer $lineNPBToken" \
-H "Content-Type: image/png" \
-T examples/test.png
