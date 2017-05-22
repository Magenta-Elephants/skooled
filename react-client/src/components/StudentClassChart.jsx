import React from 'react';
import ReactHighcharts from 'react-highcharts';

class StudentClassChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    this.currentClass = this.props.class || {grades: [] };

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
      data: this.props.grades,
    }]
  };
    return <ReactHighcharts config={config}></ReactHighcharts>
  }
}

const style = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
};

export default StudentClassChart;