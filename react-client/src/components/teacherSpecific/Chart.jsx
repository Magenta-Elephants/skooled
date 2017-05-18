import React from 'react';
import ReactHighcharts from 'react-highcharts';

class Chart extends React.Component {
  constructor(props) {
    super(props);
  }

  formatData(data) {
    var result = [];
    // gurantees order
    var keys = Object.keys(data).sort();
    console.log(data);
    for (var i = 0; i < keys.length; i++) {
      var obj = {
        y: data[keys[i]].length,
        data: data[keys[i]]
      };
      result.push(obj);
    }
    return result;
  }

  categorizeData(data) {
    var grades = {
      0: [],
      60: [],
      70: [],
      80: [],
      90: []
    };
    data.forEach((el, index) => {
      var obj = {
        grade: el.Grade
      };
      obj.name = (this.props.type === "Student") ? el.Name : el.F_Name + ' ' + el.L_Name;

      var place = Math.floor(el.Grade / 10) * 10;
      if (place >= 100) {
        grades[90].push(obj);
      } else if (place < 60) {
        grades[0].push(obj);
      } else {
        grades[place].push(obj);
      };
    });

    return grades;
  }

  render() {
    this.currentItem = this.props.item || { grades: [] }; 
    var categorizedData = this.categorizeData(this.currentItem.grades);
    var formattedData = this.formatData(categorizedData);

    var config = {
      title: {
        text: 'Midterm Assessment'
      },
      chart: {
        type: 'column'
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
        categories: ['0-59%', '60-69%', '70-79%', '80-89%', '90-100%']
      },
      series: [{
        data: formattedData
      }]
    };
    return <ReactHighcharts config={config}></ReactHighcharts>
  }
}

export default Chart;