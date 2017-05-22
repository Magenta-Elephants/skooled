import React from 'react';
import ReactHighcharts from 'react-highcharts';

class StudentClassChart extends React.Component {
  constructor(props) {
    super(props);
  }

  formatData(data) {

  }

  categorizeData(data) {
    var grades = {
      0: [70],
      1: [75],
      2: [60],
      3: [80],
      4: [95]
    };

    return grades;
  }

  render() {
    this.currentClass = this.props.class || {grades: [] };
    var formattedData = this.categorizeData();

    var config = {
      title: {
        text: 'Class'
      },
      chart: {
       type: 'column',
        width: 550 
      },
    tooltip: {
      formatter: function() {
        var final = 'Students:';
        // for each object in data 
        this.point.data.forEach((el) => {
          final += '<br>' + el.name + ': ' + el.grade; 
        });

        return final;
      }
    },
    xAxis: {
      categories: ['Assgnmnt 0', '1', '2', '3', '4', '5']
    },
    series: [{
      _colorIndex: 0,
      // data: [
        // {
          data: this.props.grades,
          // y: 1
        // },
        // {
        //   data: [{
        //     grade: 75
        //   }],
        //   y: 1
        // },
        // {
        //   data: [{
        //     grade: 60
        //   }],
        //   y: 1
        // },
        // {
        //   data: [{
        //     grade: 80
        //   }],
        //   y: 1
        // },
        // {
        //   data: [{
        //     grade: 95
        //   }],
        //   y: 1
        // }
      // ]
    }]
  };
    return <ReactHighcharts config={config}></ReactHighcharts>
  }
}

export default StudentClassChart;