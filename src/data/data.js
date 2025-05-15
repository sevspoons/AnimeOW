import animeData from "./data.json";

const minLink = 5; // 最小连接数

let tagMap = null;
let animeMap = null;
let searchData = null;

function init() {
  tagMap = {};
  animeMap = {};

  // 删去重名anime
  animeData = animeData.filter(
    (anime, index, self) =>
      index === self.findIndex((a) => a.name === anime.name)
  );
  // 构建animeMap
  animeData.forEach((anime) => {
    if (animeMap[anime.name] === undefined) {
      animeMap[anime.name] = anime;
    }
  });

  animeData.forEach((anime) => {
    // 删去与anime重名的tag
    anime.tags = anime.tags.filter((tag) => animeMap[tag.name] === undefined);
    // tags去重
    anime.tags = anime.tags.filter(
      (tag, index, self) => index === self.findIndex((t) => t.name === tag.name)
    );
    // 构建tagMap
    anime.tags.forEach((tag) => {
      if (tagMap[tag.name] === undefined) {
        tagMap[tag.name] = [anime];
      } else {
        tagMap[tag.name].push(anime);
      }
    });
  });

  // 构建searchData
  searchData = [];
  for (let anime of Object.values(animeMap)) {
    // 名称 / 中文名称 => anime
    searchData.push({
      label: anime.name,
      value: anime,
      type: "Anime",
    });
    if (anime.name_cn) {
      searchData.push({
        label: anime.name_cn,
        value: anime,
        type: "Anime",
      });
    }
  }
  for (let tag of Object.keys(tagMap)) {
    // tag => tag
    searchData.push({
      label: tag,
      value: tag,
      type: "Tag",
    });
  }
}

export function getTagMap() {
  if (!tagMap) {
    init();
  }
  return tagMap;
}

export function getAnimeMap() {
  if (!animeMap) {
    init();
  }
  return animeMap;
}

export function getSearchData() {
  if (!searchData) {
    init();
  }
  return searchData;
}

export function getRandomAnime() {
  let randomIndex = Math.floor(Math.random() * animeData.length);
  return animeData[randomIndex];
}

export function getRandomTag() {
  let tagList = Object.keys(getTagMap());
  let tagMap = getTagMap();
  let randomIndex = Math.floor(Math.random() * tagList.length);
  while (tagMap[tagList[randomIndex]].length < minLink) {
    randomIndex = Math.floor(Math.random() * tagList.length);
  }

  return tagList[randomIndex];
}
