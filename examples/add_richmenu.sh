source .env.dev

if [ "$lineNPBToken" = "" ];then
  echo "Please set lineNPBToken in .env.dev"
  exit 1
fi

curl -v -X POST https://api.line.me/v2/bot/richmenu \
-H "Authorization: Bearer $lineNPBToken" \
-H 'Content-Type: application/json' \
-d \
'{
  "size":{
      "width":2500,
      "height":1686
  },
  "selected": false,
  "name": "LINE Developers Info",
  "chatBarText": "Tap to open",
  "areas": [
      {
          "bounds": {
              "x": 0,
              "y": 0,
              "width": 2500,
              "height": 1686
          },
          "action": {
              "type": "message",
              "text": "text from rich menu"
          }
      }
  ]
}'
