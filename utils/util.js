const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getSubject(){
  let timestamp = Date.parse(new Date());
  let date = new Date(timestamp);
  //获取年份  
  let Y =date.getFullYear()
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let minute = date.getMinutes()
  if(Number(M) > 6){
    M = 2
  }else{
    M = 1
  }
  let subject1 = "WCQ Y" + Y + " " + M +"H KPI Review Meeting"
  let subject2 = "逆风杨帆 劈波斩浪"
  let subject = {subject1:subject1,subject2:subject2}
  return subject
}

module.exports = {
  formatTime:formatTime,
  getSubject:getSubject
}
