import { useContext, useEffect, useRef } from "react";
import "../style/infoPanel.css";
import { ControlContext } from "../App";
import * as echarts from "echarts";
import { getTagMap } from "../data/data";

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
  // anime评分
  const TAChartRef = useRef(null);
  const rankChartInstanceRef = useRef(null);
  useEffect(() => {
    if (!rankChartInstanceRef.current) {
      rankChartInstanceRef.current = echarts.init(TAChartRef.current, null, {
        animation: true,
      });
    }
    const option = animeRatingOption(anime.rating);
    rankChartInstanceRef.current.setOption(option);
  });
  /// anime相关tag
  const tagChartRef = useRef(null);
  const tagChartInstanceRef = useRef(null);
  useEffect(() => {
    if (!tagChartInstanceRef.current) {
      tagChartInstanceRef.current = echarts.init(tagChartRef.current, null, {
        animation: true,
      });
    }
    const option = animeTagOption(anime.tags);
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
          <p className="title">{anime.name}</p>
          <p className="sub-title">{anime.name_cn || ""}</p>
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
        <div ref={TAChartRef} className="rank-chart"></div>
      </div>
      <div className="ranker anime card">
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
  // tag相关动漫
  const TAChartRef = useRef(null);
  const TAChartInstanceRef = useRef(null);
  useEffect(() => {
    if (!TAChartInstanceRef.current) {
      TAChartInstanceRef.current = echarts.init(TAChartRef.current, null, {
        animation: true,
      });
    }
    const option = tagAnimeOption(tag);
    TAChartInstanceRef.current.setOption(option, true);
  });
  // tag相关tag
  const TTChartRef = useRef(null);
  const TTChartInstanceRef = useRef(null);
  useEffect(() => {
    if (!TTChartInstanceRef.current) {
      TTChartInstanceRef.current = echarts.init(TTChartRef.current, null, {
        animation: true,
      });
    }
    const option = tagTagOption(tag);
    TTChartInstanceRef.current.setOption(option, true);
  });
  return (
    <>
      <div className="header tag card">
        <div className="header-text">
          <p className="title">{"# " + tag}</p>
        </div>
      </div>
      <div className="ranker tag card">
        <div className="rank-text">
          <p>
            相关动漫数:
            <span
              style={{ fontSize: "1.2rem", color: "#f38181", margin: "5px" }}
            >
              {getTagMap()[tag]?.length}
            </span>
          </p>
        </div>
        <div ref={TAChartRef} className="rank-chart"></div>
      </div>
      <div className="ranker tag card">
        <div ref={TTChartRef} className="rank-chart full"></div>
      </div>
    </>
  );
}

function animeRatingOption(rating) {
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

function animeTagOption(tags) {
  let data = tags.length > 6 ? tags.slice(0, 6) : tags;
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

function tagAnimeOption(tag) {
  const NUM = 6; // 展示番剧数

  let animes = getTagMap()[tag];
  let data = [];
  // 根据关联度标记anime
  animes.forEach((anime) => {
    data.push({
      name: anime.name_cn || anime.name,
      value: anime.tags.find((t) => t.name === tag)?.count,
    });
  });
  // data排序, 截取
  data.sort((a, b) => b.value - a.value);
  data = data.length > NUM ? data.slice(0, NUM) : data;

  return {
    polar: {
      radius: [10, "80%"],
    },
    radiusAxis: {
      max: Math.ceil(data[0].value * 1.2),
    },
    angleAxis: {
      type: "category",
      data: data.map((item) => item.name),
      startAngle: 90,
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        return `${params.name} : ${params.data}关联度`;
      },
    },
    series: {
      type: "bar",
      data: data.map((item) => item.value),
      coordinateSystem: "polar",
      itemStyle: {
        color: "#aa96da",
        opacity: 0.9,
      },
      label: {
        show: true,
        position: "middle",
        formatter: "{c}",
      },
    },
    animation: false,
  };
}

function tagTagOption(tag) {
  const NUM = 6;
  const animes = getTagMap()[tag];
  // 计数相关tag
  let cnt = {};
  animes.forEach((anime) => {
    anime.tags.forEach((tag) => {
      cnt[tag.name] = (cnt[tag.name] || 0) + 1;
    });
  });

  // 计算cnt中数值最大的NUM个 不等于传入tag的 tag
  let data = [];
  for (let key in cnt) {
    if (key !== tag) {
      data.push({
        name: key,
        value: cnt[key],
      });
    }
  }
  let len = data.length;
  // data排序, 截取
  data.sort((a, b) => b.value - a.value);
  data = data.length > NUM ? data.slice(0, NUM) : data;

  return {
    title: {
      text: `共${len}个相关Tag`,
      left: "center",
      top: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        return `${params.name} : ${params.data.value}个共同关联番剧`;
      },
    },
    series: [
      {
        type: "graph",
        layout: "circular",
        symbol: "circle",
        data: data.map((item) => ({
          name: item.name,
          symbolSize: (item.value / data[0].value) * 100,
          value: item.value,
        })),
        label: {
          show: true,
          position: "inside",
          formatter: "{b}",
        },
      },
    ],
  };
}
