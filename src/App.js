import "./App.css";
import Background from "./component/background";
import InfoPanel from "./component/infoPanel";
import ChartArea from "./component/chartArea";
import { createContext, useState } from "react";
import { Global } from "./global";
import { getRandomAnime, getRandomTag } from "./data/data";
import { Search } from "./component/search";
import { StaticInfo } from "./component/staticInfo";

export const ControlContext = createContext(Global.control);

function App() {
  const [mode, setMode] = useState(Global.staticMode); //展示静态数据 动态选中数据

  // 随机获取一个anime或tag
  let randomIndex = Math.floor(Math.random() * 2);
  let data = randomIndex === 0 ? getRandomAnime() : getRandomTag();
  const [focus, setFocus] = useState(data); //选中节点数据

  return (
    <ControlContext.Provider
      value={{ mode: [mode, setMode], focus: [focus, setFocus] }}
    >
      <div className="App">
        <Background />
        {mode === Global.staticMode ? <StaticInfo /> : <InfoPanel />}
        <ChartArea />
        <Search />
      </div>
    </ControlContext.Provider>
  );
}

export default App;
