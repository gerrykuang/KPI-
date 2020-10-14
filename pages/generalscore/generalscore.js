Page({
  data: {
    tableData: [],
    threeArray: '', //模拟将后台获取到的数组对象数据按照一行3个的单元数据的格式切割成新的数组对象（简单的说：比如获取到数组是9个元素，切分成，3个元素一组的子数组）
  },
  onLoad: function(options) {
    let that = this;
    var bean = JSON.parse(options.scoreList);
    that.data.tableData = bean;
    let threeArray = [];
    // 使用for循环将原数据切分成新的数组
    for (let i = 0, len = that.data.tableData.length; i < len; i += 1) {
      threeArray.push(that.data.tableData.slice(i, i + 1));
    }
    console.log(threeArray);
    that.setData({
      tableData: bean,
      threeArray: threeArray
    })
  },
})