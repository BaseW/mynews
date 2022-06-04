source .env.dev

if [ "$deploymentId" = "" ];then
  echo "Please set deploymentId in .env.dev"
  exit 1
fi

clasp deploy --deploymentId $deploymentId --description "開発環境"
