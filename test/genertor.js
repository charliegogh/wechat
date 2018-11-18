var g=function *(n) {
  for (var i=0;i<3;i++){
      n++;
      yield n  /*暂停执行,遇到next()将继续去执行
      */
  }
};
var genObj=g(2)
console.log(genObj.next());
console.log(genObj.next());
console.log(genObj.next());
console.log(genObj.next());   /*{ value: undefined, done: true } done表示是否被执行完毕,当执行完毕就是true*/
