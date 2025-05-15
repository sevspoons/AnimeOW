import { ControlContext } from "../App";
import { getSearchData } from "../data/data";
import { SearchIcon } from "../static/icon";
import "../style/search.css";
import { useContext, useState } from "react";

const maxSearchResults = 100; // 最大搜索结果数量

export function Search() {
  const items = getSearchData(); // 获取搜索数据
  const setFocus = useContext(ControlContext).focus[1];
  const [show, setShow] = useState(false); // 控制搜索框的显示和隐藏

  const handleItemSelected = (value) => {
    // 这里是您想要执行的回调函数
    setFocus(value); // 设置选中节点数据
    setShow(false); // 隐藏搜索框
  };
  return (
    <div className="search-container">
      {show ? (
        <>
          <SearchComponent items={items} onItemSelected={handleItemSelected} />
          <div
            onClick={() => {
              setShow(false);
            }}
          >
            <SearchIcon />
          </div>
        </>
      ) : (
        <div
          onClick={() => {
            setShow(true);
          }}
        >
          <SearchIcon />
        </div>
      )}
    </div>
  );
}

const SearchComponent = ({ items, onItemSelected }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = items.filter((item) =>
      item.label.toLowerCase().includes(value)
    );
    // 限制搜索结果数量
    if (filtered.length > maxSearchResults) {
      filtered.splice(maxSearchResults);
    }
    setFilteredItems(filtered);
  };

  const handleItemClick = (value) => {
    onItemSelected(value);
    setSearchTerm(""); // 清空搜索框
    setFilteredItems([]); // 清空搜索结果
  };

  return (
    <div>
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        autoComplete="off"
      />
      <div className="search-result">
        {filteredItems.map((item, index) => (
          <div
            className="search-item"
            key={index}
            onClick={() => handleItemClick(item.value)}
          >
            <div
              style={{
                backgroundColor: item.type === "anime" ? "#f38181" : "#11999e",
                color: "#fff",
                padding: "2px 5px 5px 5px",
                borderRadius: "5px",
                marginRight: "5px",
              }}
            >
              {item.type}
            </div>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
