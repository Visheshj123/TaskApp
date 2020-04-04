function myFunc(a,b){
  return new Promise((resolve, reject) => {
    resolve(a+b)
  })
}




async function test(){
  const sum = await myFunc(2,3);
  console.log(sum);
}

test();
