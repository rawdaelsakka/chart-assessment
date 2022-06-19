import React, { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRouter } from 'next/router';

function LineChart(props) {
  const router = useRouter();
  const chartRef = useRef < ChartJS > null;
  const options = {
    id: 'Chart',
    title: {
      display: true,
      text: 'Number of lessons',
      fontSize: 20
    },
    scales: {
      xAxis: {
        display: true,
        tickColor: ''
      },
      yAxis: {
        display: true
      }
    },
    layout: {
      padding: '30'
    },
    plugins: {
      legend: {
        display: false,
        position: 'right'
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          footer: (tooltipItems) => {
            let sum = 0;
            tooltipItems.forEach(function (tooltipItem) {
              sum += tooltipItem.parsed.y;
            });
            return 'Lessons: ' + sum;
          }
        }
      }
    }
  };

  const onClick = (el) => {
    router.push({
      pathname: '/chart',
      query: {
        country: props.country.value,
        camp: props.camp.value,
        school: el.label,
        total: el.total,
        data: el.data
      }
    });
  };

  return (
    <div className="chart">
      {(!props.country.value || !props.camp.value) && (
        <>
          <div className="chart-info">Please Select Country and Select Camp to load the chart!</div>
        </>
      )}
      {props.country.value && props.camp.value && (
        <>
          <div className="chart-wrapper">
            <div>
              <Line data={props.chartData} options={options} />
            </div>
          </div>
          <div className="chart-lessons">
            <div className="title">
              <div className="title-head">
                <span className="title-count">{props.totalLessons}</span> Lessons
              </div>
              <span className="title-sub">in {props.camp ? props.camp.value : ''}</span>
            </div>
            <div className="chart-lessons_schools">
              {props.chartData &&
                props.chartData.datasets.map((el, i) => (
                  <div key={i} className={`${el.hidden ? 'wrapper hidden' : 'wrapper show'}`}>
                    <div
                      key={i}
                      className="title"
                      style={{ color: el.borderColor }}
                      onClick={() => onClick(el)}>
                      <div className="title-head">
                        <span className="title-count">{el.total}</span> Lessons
                      </div>
                      <span className="title-sub">in {el.label}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LineChart;
