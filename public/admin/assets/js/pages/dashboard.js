
////first chart
fetch('/admin/dashboard/orderInWeek',{
  method:'get'
}).then(data =>data.json())
.then(data => {
let feilds = []
let values =[]
  for(val of data){
    let date = `${val.detail.day}/${val.detail.month}/${val.detail.year}`
    feilds.push(date)
    values.push(val.count)
  }
var optionsProfileVisit = {
  annotations: {
    position: "back",
  },
  dataLabels: {
    enabled: false,
  },
  chart: {
    type: "bar",
    height: 300,
  },
  fill: {
    opacity: 1,
  },
  plotOptions: {},
  series: [
    {
      name: "sales",
      // data: [9, 20, 30, 20, 10, 20, 30],
      data: [...values],
    },
  ],
  colors: "#435ebe",
  xaxis: {
    // categories: [
    //   'sun',
    //   'mon',
    //   'tue',
    //   'wed',
    //   'the',
    //   'fri',
    //   'sat',
    // ],
    categories:[...feilds]
  },
}
var chartProfileVisit = new ApexCharts(
  document.querySelector("#chart-profile-visit"),
  optionsProfileVisit
)
chartProfileVisit.render()
})

// second chart
fetch("/admin/dashboard/orderInMonth",{
  method:'get'
}).then(data =>data.json())
.then(data =>{
console.log(data[0]._id,'monj=================')
let feilds = []
let values =[]
  for(val of data){

    switch (val._id) {
      case 1:
      feilds.push('January')
        break;
      case 2:
      feilds.push('February')
        break;
      case 3:
      feilds.push('March')
        break;
      case 4:
      feilds.push('April')
        break;
      case 5:
      feilds.push('May')
        break;
      case 6:
      feilds.push('June')
        break;
      case 7:
      feilds.push('July')
        break;
      case 8:
      feilds.push('August')
        break;
      case 9:
      feilds.push('September')
        break;
      case 10:
      feilds.push('October')
        break;
      case 11:
      feilds.push('November')
        break;
      case 12:
      feilds.push('December')
        break;
      
    }
    values.push(val.count)
  }

var optionsMonth = {
  annotations: {
    position: "back",
  },
  dataLabels: {
    enabled: false,
  },
  chart: {
    type: "bar",
    height: 300,
  },
  fill: {
    opacity: 1,
  },
  plotOptions: {},
  series: [
    {
      name: "sales",
      // data: [9, 20, 30, 20, 10, 20, 30],
      data: [...values],
    },
  ],
  colors: "#435ebe",
  xaxis: {
    // categories: [
    //   'sun',
    //   'mon',
    //   'tue',
    //   'wed',
    //   'the',
    //   'fri',
    //   'sat',
    // ],
    categories:[...feilds]
  },
}
var chartMonth = new ApexCharts(
  document.querySelector("#chart-month"),
  optionsMonth
)
chartMonth.render()

})

///
let optionsVisitorsProfile = {
  series: [70, 30],
  labels: ["Male", "Female"],
  colors: ["#435ebe", "#55c6e8"],
  chart: {
    type: "donut",
    width: "100%",
    height: "350px",
  },
  legend: {
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "30%",
      },
    },
  },
}

var optionsEurope = {
  series: [
    {
      name: "series1",
      data: [310, 800, 600, 430, 540, 340, 605, 805, 430, 540, 340, 605],
    },
  ],
  chart: {
    height: 80,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  colors: ["#5350e9"],
  stroke: {
    width: 2,
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    categories: [
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      "2018-09-19T04:30:00.000Z",
      "2018-09-19T05:30:00.000Z",
      "2018-09-19T06:30:00.000Z",
      "2018-09-19T07:30:00.000Z",
      "2018-09-19T08:30:00.000Z",
      "2018-09-19T09:30:00.000Z",
      "2018-09-19T10:30:00.000Z",
      "2018-09-19T11:30:00.000Z",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  show: false,
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
}

let optionsAmerica = {
  ...optionsEurope,
  colors: ["#008b75"],
}
let optionsIndonesia = {
  ...optionsEurope,
  colors: ["#dc3545"],
}

var chartProfileVisit = new ApexCharts(
  document.querySelector("#chart-profile-visit"),
  optionsProfileVisit
)
var chartVisitorsProfile = new ApexCharts(
  document.getElementById("chart-visitors-profile"),
  optionsVisitorsProfile
)
var chartEurope = new ApexCharts(
  document.querySelector("#chart-europe"),
  optionsEurope
)
var chartAmerica = new ApexCharts(
  document.querySelector("#chart-america"),
  optionsAmerica
)
var chartIndonesia = new ApexCharts(
  document.querySelector("#chart-indonesia"),
  optionsIndonesia
)

chartIndonesia.render()
chartAmerica.render()
chartEurope.render()
// chartProfileVisit.render()
chartVisitorsProfile.render()
