import "./App.css";
import Background from "./component/background";
import InfoPanel from "./component/infoPanel";
import ChartArea from "./component/chartArea";
import { createContext, useState } from "react";
import { Global } from "./global";

export const ControlContext = createContext(Global.control);

function App() {
  const [mode, setMode] = useState(Global.staticMode); //展示静态数据 动态选中数据
  const [focus, setFocus] = useState(null); //选中节点数据

  return (
    <ControlContext.Provider
      value={{ mode: [mode, setMode], focus: [focus, setFocus] }}
    >
      <div className="App">
        <Background />
        <InfoPanel />
        <ChartArea />
      </div>
    </ControlContext.Provider>
  );
}

export default App;
