import React from "react";
import Chart from 'react-apexcharts'
import { roomPlayersConst } from "./components/Lobby";

const hex="0123456789ABCDEF";
const m={};

class PieChart extends React.Component {
    constructor(props) {
      super(props);

      const s = Array.from(new Set(roomPlayersConst));
      for (let i=0; i<s.length; i++){
          let randColor="#";
          for (let x=0; x<6; x++){
              randColor+=hex[Math.floor(Math.random() * (15) )];
          }
          if (!(s[i] in m)){
            m[s[i]] = randColor;
          }
      }
      
      this.colors=this.getColors(props.list);
      this.state = {
      
        series: props.weight,
        options: {
          chart: {
            width: 400,
            type: 'pie',
          },
          colors: this.colors,
          labels: props.list,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
      
      
      };
    }

    getColors(list){
      const colors=[];
      for (let i=0; i<list.length; i++){
        colors.push(m[list[i]]);
      }
      return colors;
    }

    render() {
      return (
        <div id="chart">
            <Chart options={this.state.options} series={this.state.series} type="pie" width={380} />
        </div>
      );
    }
  }

export default PieChart;