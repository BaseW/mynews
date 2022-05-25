if [ $# != 1 ];then
  echo "Please provide branch name"
  exit 1
fi

new_branch_name=$1

git checkout -b $new_branch_name
git commit --allow-empty -m "empty commit"
