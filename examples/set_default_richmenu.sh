source .env.dev

if [ "$lineNPBToken" = "" ];then
  echo "Please set lineNPBToken in .env.dev"
  exit 1
fi

if [ "$richMenuId" = "" ];then
  echo "Please set richMenuId in .env.dev"
  exit 1
fi

curl -v -X POST https://api.line.me/v2/bot/user/all/richmenu/$richMenuId \
-H "Authorization: Bearer $lineNPBToken"
