
let NOT_DEAL_ME = Symbol("NOT_DEAL_ME")
function removeDump(ar,condition){
  let existedDic = new Set();
  for(let i = ar.length - 1;i>=0;i--){
    let checkKey = condition(ar[i],i);

    //如果该元素不参与去重，则跳过当前循环
    if(checkKey === NOT_DEAL_ME){
      existedDic.add(checkKey)
      continue;
    }

    if(existedDic.has(checkKey)){
      ar.splice(i,1);
    }else{
      existedDic.add(checkKey)
    }
  }
  return ar;
}
function removeItem(ar,condition){
  for(let i = ar.length - 1;i>=0;i--){
    if(condition(ar[i],i)){
      ar.splice(i,1);
    }
  }
  return ar;
}

module.exports = {
  removeItem,
  removeDump,
  NOT_DEAL_ME
}