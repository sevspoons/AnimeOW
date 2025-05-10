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

  useEffect(() => {
    if (!rankChartInstanceRef.current) {
      rankChartInstanceRef.current = echarts.init(rankChartRef.current, null, {
        animation: true,
      });
    }
    const option = getRankOption(anime.rating);
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
        <div ref={rankChartRef} className="rank-chart"></div>
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

function getRankOption(rating) {}
