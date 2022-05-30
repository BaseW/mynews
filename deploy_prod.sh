source .env

if [ "$deploymentId" = "" ];then
  echo "Please set deploymentId in .env"
  exit 1
fi

clasp deploy --deploymentId $deploymentId --description "本番環境"
