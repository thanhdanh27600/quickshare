import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';
import { Window } from 'types/constants';

interface Props {
  label: (string | number | null)[];
  value: (string | number | null)[][];
  className?: string;
}

export const GeoChart = (props: Props) => {
  const { className, label, value } = props;
  const [loaded, setLoaded] = useState(false);
  const google = Window().google;
  const id = 'regions_div';

  const drawRegionsMap = useCallback(
    function () {
      const element = document.getElementById(id);

      var data = google.visualization.arrayToDataTable([label, ...value]);

      var options = {
        legend: 'none',
        backgroundColor: '#fcfcfd',
        tooltip: {
          textStyle: {
            fontName: 'Roboto Slab',
            fontSize: 12,
          },
        },
        colorAxis: { minValue: 0, colors: ['#9d8ed1', '#6644de'] },
      };

      const chart = new google.visualization.GeoChart(element);

      chart.draw(data, options);
    },
    [loaded, google],
  );

  useEffect(() => {
    if (!google) return;
    google.charts.load('current', {
      packages: ['geochart'],
    });
    google.charts.setOnLoadCallback(drawRegionsMap);
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

      <div id={id} className={className}></div>
    </>
  );
};
