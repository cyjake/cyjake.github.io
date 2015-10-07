/* eslint-disable strict */
;(function() {
  var map = new BMap.Map('map')
  var start = '瑞安市人民政府'
  var end = '瑞安市鹿木乡彭埠村鹿木居酒楼'

  var driving = new BMap.DrivingRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: true,
    },
    policy: BMAP_DRIVING_POLICY_LEAST_TIME
  })

  map.clearOverlays()
  driving.search(start, end)
})()
