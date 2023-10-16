import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Window } from 'types/constants';

interface Props {
  label: any[];
  value: (string | number | null)[][];
  title?: string;
  className?: string;
}

export const BarChart = (props: Props) => {
  const { className, title, label, value } = props;
  const [loaded, setLoaded] = useState(false);
  const google = Window().google;

  useEffect(() => {
    if (!google) return;

    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawBasic);

    function drawBasic() {
      var data = google.visualization.arrayToDataTable([label, ...value]);

      var options = {
        title,
        backgroundColor: '#fcfcfd',
        hAxis: {
          minValue: 0,
        },
        fontName: 'Roboto Slab',
        fontSize: 12,
        legend: 'none',
      };

      var chart = new google.visualization.BarChart(document.getElementById('bar-div'));

      chart.draw(data, options);

      return () => {
        chart.clearChart();
      };
    }
  }, [loaded, google]);

  if (value.length === 0) return null;

  return (
    <>
      <Script
        onLoad={() => {
          setLoaded(true);
        }}
        type="text/javascript"
        src="https://www.gstatic.com/charts/loader.js"
      />

      <div id="bar-div" className={className}></div>
    </>
  );
};
