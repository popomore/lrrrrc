# Lrrrrc

Easy way to download lrc based on nodejs

---

```
exports.search({artist: 'SHE', title: '美丽新世界'}, function(err, data) {
  console.log(data);
  exports.download(data[0], function(err, data) {
    console.log(data);
  })
})
```
