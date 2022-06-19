import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { allMonths } from '../../components/data-types.js';

function ChartPage() {
  const router = useRouter();

  return (
    <Fragment>
      <div className="chart-details">
        <h1>Chart Details Page</h1>
        <div>
          <h1>Country name: {router.query.country}</h1>
          <h2>Camp name: {router.query.camp}</h2>
          <h3>School name: {router.query.school}</h3>
          <h3>Total lessons: {router.query.total}</h3>
          <div className="table-wrapper">
            <div className="data-wrapper">
              <div className="data-wrapper_month">Month</div>
              <div className="data-wrapper_item">Total</div>
            </div>
            {router.query.data &&
              router.query.data.map((el, index) => (
                <div key={index}>
                  <div className="data-wrapper">
                    <div className="data-wrapper_month">{allMonths[index]}</div>
                    <div className="data-wrapper_item">{el}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ChartPage;
