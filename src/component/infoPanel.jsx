import { useContext, useEffect, useRef } from "react";
import "../style/infoPanel.css";
import { ControlContext } from "../App";
import * as echarts from "echarts";

export default function InfoPanel() {
  return (
    <div className="info-panel">
      <InfoCard />
    </div>
  );
}

export function InfoCard() {
  const focus = useContext(ControlContext).focus[0];
  return (
    <div className="info-card">
      {focus?.name ? (
        <InfoCardAnime anime={focus} />
      ) : (
        <InfoCardTag tag={focus} />
      )}
    </div>
  );
}

function InfoCardAnime({ anime }) {
  const rankChartRef = useRef(null);
  const rankChartInstanceRef = useRef(null);

  const tagChartRef = useRef(null);
  const tagChartInstanceRef = useRef(null);

  useEffect(() => {
    if (!rankChartInstanceRef.current) {
      rankChartInstanceRef.current = echarts.init(rankChartRef.current, null, {
        animation: true,
      });
    }
    const option = getRankOption(anime.rating);
    rankChartInstanceRef.current.setOption(option);
  });

  useEffect(() => {
    if (!tagChartInstanceRef.current) {
      tagChartInstanceRef.current = echarts.init(tagChartRef.current, null, {
        animation: true,
      });
    }
    const option = getTagOption(anime.tags);
    tagChartInstanceRef.current.setOption(option);
  });

  return (
    <>
      <div className="header anime card">
        <img
          src={anime.images.large}
          className="header-img"
          alt={anime.name}
        ></img>
        <div className="header-text">
          <p className="jp">{anime.name}</p>
          <p className="cn">{anime.name_cn || ""}</p>
          <p className="date">{anime.date}</p>
        </div>
      </div>
      <div className="ranker anime card">
        <div className="rank-text">
          <p>
            评分:
            <span
              style={{ fontSize: "1.5rem", color: "#f08a5d", margin: "5px" }}
            >
              {anime.rating.score}
            </span>
          </p>
          <p>
            评分人数:
            <span
              style={{ fontSize: "1.2rem", color: "#f38181", margin: "5px" }}
            >
              {anime.rating.total}
            </span>
          </p>
        </div>
        <div ref={rankChartRef} className="rank-chart"></div>
      </div>
      <div className="ranker card">
        <div className="rank-text">
          <p>
            共有
            <span
              style={{ fontSize: "1.5rem", color: "#f08a5d", margin: "5px" }}
            >
              {anime.tags.length}
            </span>
            个相关Tag
          </p>
        </div>
        <div ref={tagChartRef} className="rank-chart"></div>
      </div>
    </>
  );
}

function InfoCardTag({ tag }) {
  return (
    <>
      <div>222</div>
    </>
  );
}

function getRankOption(rating) {
  let x = Object.keys(rating.count);
  let y = Object.values(rating.count);
  return {
    grid: {
      top: "5%",
      left: "10%",
      right: "0px",
      bottom: "10%",
    },
    xAxis: {
      type: "category",
      data: x,
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        var tar = params[0];
        return tar.name + "分 : " + tar.value + "人";
      },
    },
    series: [
      {
        data: y,
        type: "bar",
      },
    ],
  };
}

function getTagOption(tags) {
  let data = tags.length > 6 ? tags.slice(0, 6) : tags;
  console.log(data);
  return {
    grid: {
      top: "5%",
      left: "0%",
      right: "0px",
      bottom: "0%",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        let data = params.data;
        return `${data.name} : ${data.value}关联度`;
      },
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["60%", "120%"],
        center: ["50%", "80%"],
        // adjust the start and end angle
        startAngle: 180,
        endAngle: 360,
        data: data.map((item) => ({
          value: parseInt(item.count),
          name: item.name,
        })),
      },
    ],
  };
}
