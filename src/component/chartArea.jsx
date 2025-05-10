import { useContext, useEffect, useRef } from "react";
import "../style/chartArea.css";
import * as echarts from "echarts";
import { getChartConfig } from "../data/chartConfig";
import { ControlContext } from "../App";
import { Global } from "../global";
import { getAnimeMap } from "../data/data";

export default function ChartArea() {
  return (
    <div className="chart-area">
      <div className="center"></div>
      <Chart />
    </div>
  );
}

export function Chart() {
  const [focus, setFocus] = useContext(ControlContext).focus;
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, null, {
        animation: true,
      });
    }
    const option = getChartConfig(focus, {
      x: chartInstanceRef.current.getWidth(),
      y: chartInstanceRef.current.getHeight(),
    });
    chartInstanceRef.current.setOption(option, true);

    chartInstanceRef.current.on("click", function (params) {
      if (params.dataType === "node") {
        if (params.data.category === Global.anime) {
          setFocus(getAnimeMap()[params.data.name]);
        } else if (params.data.category === Global.tag) {
          setFocus(params.data.name);
        }
      } else {
        console.log("点击了边：", params.data);
      }
    });

    return () => {
      chartInstanceRef.current.off("click");
    };
  }, [focus, setFocus]);

  return <div className="chart" ref={chartRef}></div>;
}
