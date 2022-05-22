if [ $# != 1 ]; then
    echo 引数エラー: $*
    exit 1
else
    echo OK
fi

no_update=$1

if [ $no_update -ne 1 ];then
  echo "start building..."
  npm run build
  echo "finish building";
fi

echo "starting test"
firebase emulators:exec ./test_request.sh
echo "finish test"
