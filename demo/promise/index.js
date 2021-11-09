const aa = new Promise((resolve, reject) => {
    resolve("abc");
//   reject("err");
});

aa.then(
  (res) => {
    console.log(res);
  },
  (err) => console.log(err)
);
