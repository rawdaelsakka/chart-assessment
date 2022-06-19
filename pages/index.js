import LineChart from '../components/LineChart.js';
import Select from 'react-dropdown-select';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { useState, useEffect } from 'react';
import { allMonths, options } from '../components/data-types.js';
import { useRouter } from 'next/router';
import { prepareData } from '../components/prepare-data.js';

function HomePage(props) {
  const router = useRouter();
  Chart.register(CategoryScale);

  const [items, setItems] = useState(props.data);
  const [camps, setCamps] = useState(props.camps);
  const [schools, setSchoolsFilter] = useState(props.schools);
  const [countries, setCountries] = useState(props.countries);

  const [totalLessons, setTotalLessons] = useState();
  const [schoolsChart, setSchoolsChart] = useState();
  const [chartData, setChartData] = useState({ label: allMonths, datasets: [] });

  const [selectedCamp, setSelectedCamp] = useState({ key: 0, value: router.query.camp || null });
  const [selectedSchool, setSelectedSchool] = useState({
    key: 0,
    value: router.query.school || null
  });
  const [selectedCountry, setSelectedCountry] = useState({
    key: 0,
    value: router.query.country || null
  });

  useEffect(() => {
    router.query.school = selectedSchool.value;
    router.query.country = selectedCountry.value;
    router.query.camp = selectedCamp.value;
    router.push(router);
    prepareSchoolsChart();
  }, [selectedCountry, selectedCamp, selectedSchool]);

  function prepareSchoolsChart() {
    let data = [];
    let arrLessonsPerSchool = [];
    if (!!selectedSchool.key) {
      data = items.filter(
        (el) =>
          el.camp == selectedCamp.value &&
          el.country == selectedCountry.value &&
          el.school == selectedSchool.value
      );
    } else if (selectedCountry.value && selectedCamp.value) {
      data = items.filter(
        (el) => el.camp == selectedCamp.value && el.country == selectedCountry.value
      );
    }

    let reducedData = data.reduce(function (arr, el) {
      arr[el.school] = arr[el.school] || [];
      arr[el.school].push(el);
      return arr;
    }, Object.create(null));

    Object.entries(reducedData).map(([k, v]) => {
      arrLessonsPerSchool.push({
        school: k,
        total: v.reduce(function (counter, value) {
          return counter + value.lessons;
        }, 0),
        data: allMonths.map((el) => {
          let data = v.filter((item) => item.month === el);
          let monthItem = { month: '', total: '' };
          monthItem['month'] = el;
          monthItem['total'] = data.length
            ? data.reduce(function (counter, value) {
                return counter + value.lessons;
              }, 0)
            : 0;
          return monthItem;
        }, v)
      });
    });

    setTotalLessons(
      data.reduce(function (counter, value) {
        return counter + value.lessons;
      }, 0)
    );
    setSchoolsChart([...arrLessonsPerSchool]);
    let chartDatasets = [];
    arrLessonsPerSchool.forEach((el, index) => {
      chartDatasets.push({
        index: index,
        total: el.total,
        label: el.school,
        fill: false,
        lineTension: 0,
        pointRadius: 5,
        backgroundColor: 'white',
        borderColor:
          `#` +
          (Math.random() * 16 * (index + 1) * arrLessonsPerSchool.length).toString(16).substr(-6),
        borderWidth: 2,
        hidden: false,
        data: el.data.map((el) => el.total)
      });
    });
    setChartData({
      labels: allMonths,
      datasets: chartDatasets
    });
    setSchoolsFilter(prepareData(['Show all', ...arrLessonsPerSchool.map((el) => el.school)]));
  }

  function onChange(type, selectedItem) {
    let filteredData = [];
    if (selectedItem) {
      switch (type) {
        case 'country':
          filteredData = items
            .filter((el) => el.country === selectedItem.value)
            .map((el) => el.camp);
          setSelectedCountry(selectedItem);
          setCamps(prepareData(filteredData));
          break;
        case 'camps':
          filteredData = items
            .filter((el) => el.camp === selectedItem.value && el.country === selectedCountry.value)
            .map((el) => el.school);
          setSelectedCamp(selectedItem);
          setSchoolsFilter(prepareData(['Show all', ...filteredData]));
          break;
        case 'school':
          if (selectedItem.key === 0) {
            onChange('camps', selectedCamp);
          } else {
            const data = [];
            data.push({ key: 0, value: 'Show all' });
            data.push(selectedItem);
            setSchoolsFilter(data);
          }
          setSelectedSchool(selectedItem);
          break;
      }
    }
  }

  return (
    <div className="content-wrapper">
      <h1>Analysis chart</h1>
      <h3>Number of lessons</h3>
      <div className="ddl-wrapper">
        <div className="ddl-wrapper-content">
          <span>Select Country * </span>
          <Select
            placeholder="Select Country"
            options={countries}
            id="countrySelect"
            instanceId="countrySelect"
            onChange={(values) => onChange('country', values[0])}
            className="ddlItem"
            labelField="value"
            valueField="key"
            required={true}
            backspaceDelete={false}
            values={[selectedCountry]}
          />
        </div>
        <div className="ddl-wrapper-content">
          <span>Select Camp * </span>
          <Select
            placeholder="Select Camp"
            options={camps}
            id="campsSelect"
            instanceId="campsSelect"
            onChange={(values) => onChange('camps', values[0])}
            className="ddlItem"
            labelField="value"
            valueField="key"
            required={true}
            backspaceDelete={false}
            values={[selectedCamp]}
          />
        </div>
        <div className="ddl-wrapper-content">
          <span>Show All</span>
          <Select
            placeholder="Show All"
            options={schools}
            id="schoolsSelect"
            instanceId="schoolsSelect"
            onChange={(values) => onChange('school', values[0])}
            className="ddlItem"
            labelField="value"
            valueField="key"
            backspaceDelete={false}
            values={[selectedSchool]}
          />
        </div>
      </div>
      <div>
        <LineChart
          country={selectedCountry}
          camp={selectedCamp}
          school={selectedSchool}
          schools={schoolsChart}
          totalLessons={totalLessons}
          chartData={chartData}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    'https://raw.githubusercontent.com/abdelrhman-arnos/analysis-fe-challenge/master/data.json'
  );
  const data = await res.json();
  let camps = prepareData([...new Set(data.map((el) => el.camp))]);
  let schools = prepareData(['Show all', ...new Set(data.map((el) => el.school))]);
  let countries = prepareData([...new Set(data.map((el) => el.country))]);
  return { props: { data, camps, schools, countries } };
}

export default HomePage;
