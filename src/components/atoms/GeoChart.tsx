import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Window } from 'types/constants';

interface Props {
  label: (string | number | null)[];
  value: (string | number | null)[][];
  className: string;
}

export const GeoChart = (props: Props) => {
  const { className, label, value } = props;
  const [loaded, setLoaded] = useState(false);
  const google = Window().google;

  useEffect(() => {
    if (!google) return;

    google.charts.load('current', {
      packages: ['geochart'],
    });
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {
      var data = google.visualization.arrayToDataTable([label, ...value]);

      var options = {
        legend: 'none',
        backgroundColor: '#f9fafb80',
        colorAxis: { minValue: 0, colors: ['#9d8ed1', '#6644de'] },
      };

      var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

      chart.draw(data, options);
    }
  }, [loaded, google]);

  return (
    <>
      <Script
        onLoad={() => {
          setLoaded(true);
        }}
        type="text/javascript"
        src="https://www.gstatic.com/charts/loader.js"
      />

      <div id="regions_div" className={className}></div>
    </>
  );
};
