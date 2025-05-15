import { ControlContext } from "../App";
import { getSearchData } from "../data/data";
import "../style/search.css";
import { useContext, useState } from "react";

const maxSearchResults = 10; // 最大搜索结果数量

export function Search() {
  const items = getSearchData(); // 获取搜索数据
  const [focus, setFocus] = useContext(ControlContext).focus;

  const handleItemSelected = (value) => {
    // 这里是您想要执行的回调函数
    setFocus(value); // 设置选中节点数据
  };

  const [show, setShow] = useState(false); // 控制搜索框的显示和隐藏

  return show ? (
    <div items={items} onItemSelected={handleItemSelected} />
  ) : (
    <div className="search-container">111</div>
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
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        autoComplete="off"
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index} onClick={() => handleItemClick(item.value)}>
            {item.label + " : " + item.type}
          </li>
        ))}
      </ul>
    </div>
  );
};
