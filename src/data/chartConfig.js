import { Global } from "../global";
import { getAnimeMap, getRandomAnime, getRandomTag, getTagMap } from "./data";

const COLOR = {
  centerA: "##aa96da",
  r1A: "#61c0bf",
  r2A: "#ffb6b9",
  centerT: "#11999e",
  r1T: "#ffb6b9",
  r2T: "#61c0bf",
};

const ROUNDNUM1 = 10;
const ROUNDNUM2 = 5;

export function getChartConfig(focus, { x, y }) {
  if (focus === null) {
    // 随机获取一个anime或tag
    let randomIndex = Math.floor(Math.random() * 2);
    focus = randomIndex === 0 ? getRandomAnime() : getRandomTag();
  }

  const [data, link] = getGraph(focus, { x, y });

  link.forEach((l) => {
    let count = parseInt(l.count);
    l.lineStyle = {};
    l.lineStyle.width = Math.min(10, Math.sqrt(count + 100) * 0.2);
  });

  // 检查data中有无name相同的元素
  let nameSet = new Set();
  data.forEach((item) => {
    if (nameSet.has(item.name)) {
      console.log(`Duplicate name found: ${item.name}`);
      console.log(data.filter((i) => i.name === item.name));
    } else {
      nameSet.add(item.name);
    }
  });

  let res = {
    tooltip: {
      show: true,
      formatter: function (params) {
        var data = params.data;
        if (data.category === Global.tag) {
          // Tag
          return `${data.name}<br />${
            getTagMap()[data.name].length
          } 个关联番剧`;
        } else if (data.category === Global.anime) {
          // 番剧
          return `${data.name}<br />热度: ${
            getAnimeMap()[data.name].rating.total
          }`;
        } else {
          // 连线
          return `关联度:  <span style="font-weight: 600;color: #f38181">${data.count}</span>`;
        }
      },
    },
    series: [
      {
        type: "graph",
        // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        roam: true,
        // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。[ default: false ]
        focusNodeAdjacency: true,
        // 力引导布局相关的配置项，力引导布局是模拟弹簧电荷模型在每两个节点之间添加一个斥力，每条边的两个节点之间添加一个引力，每次迭代节点会在各个斥力和引力的作用下移动位置，多次迭代后节点会静止在一个受力平衡的位置，达到整个模型的能量最小化。
        force: {
          // 力引导布局的结果有良好的对称性和局部聚合性，也比较美观。
          // [ default: 50 ]节点之间的斥力因子(关系对象之间的距离)。支持设置成数组表达斥力的范围，此时不同大小的值会线性映射到不同的斥力。值越大则斥力越大
          repulsion: 300,
          // [ default: 30 ]边的两个节点之间的距离(关系对象连接线两端对象的距离,会根据关系对象值得大小来判断距离的大小)，
          edgeLength: [200, 150],
          // 这个距离也会受 repulsion。支持设置成数组表达边长的范围，此时不同大小的值会线性映射到不同的长度。值越小则长度越长。如下示例:
          // 值最大的边长度会趋向于 10，值最小的边长度会趋向于 50      edgeLength: [10, 50]
        },
        // 图的布局。[ default: 'none' ]
        layout: "force",
        // 'none' 不采用任何布局，使用节点中提供的 x， y 作为节点的位置。
        // 'circular' 采用环形布局;'force' 采用力引导布局.
        // 标记的图形
        symbol: "circle",
        // 关系边的公用线条样式。其中 lineStyle.color 支持设置为'source'或者'target'特殊值，此时边会自动取源节点或目标节点的颜色作为自己的颜色。
        lineStyle: {
          // 线的颜色[ default: '#aaa' ]
          color: "source",
          // 线的类型[ default: solid实线 ]   'dashed'虚线    'dotted'
          type: "solid",
          // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。[ default: 0.5 ]
          opacity: 0.6,
          // 边的曲度，支持从 0 到 1 的值，值越大曲度越大。[ default: 0 ]
          curveness: 0,
        },
        // 关系对象上的标签
        label: {
          normal: {
            // 是否显示标签
            show: true,
            // 标签位置:'top''left''right''bottom''inside''insideLeft''insideRight''insideTop''insideBottom''insideTopLeft''insideBottomLeft''insideTopRight''insideBottomRight'
            position: "inside",
            // 文本样式
            textStyle: {
              fontSize: 16,
              color: "white",
            },
          },
        },
        data: data,
        // 节点分类的类目，可选。如果节点有分类的话可以通过 data[i].category 指定每个节点的类目，类目的样式会被应用到节点样式上。图例也可以基于categories名字展现和筛选。
        categories: [
          {
            name: "番剧",
          },
          {
            name: "Tag",
          },
          {
            name: "Link",
          },
        ],
        // 节点间的关系数据
        links: link,
      },
    ],
  };
  return res;
}

function getGraph(focus, { x, y }) {
  let TagMap = getTagMap();
  let AnimeMap = getAnimeMap();

  let data = [];
  let link = [];

  if (focus?.name) {
    // anime中心

    let name = focus.name;
    // 中心anime
    data.push({
      name: name,
      draggable: false,
      symbolSize: getAnimeSize(focus.rating.total),
      itemStyle: {
        color: COLOR.centerA,
      },
      symbol: "image://" + focus.images?.large,
      symbolKeepAspect: true,
      label: { show: false },
      category: "番剧",
      fixed: true,
      x: x / 2,
      y: y / 2,
    });

    // 外圈Tag
    let tags = focus.tags;
    let len = Math.min(tags.length, ROUNDNUM1);
    for (let i = 0; i < len; i++) {
      data.push({
        name: tags[i].name,
        draggable: true,
        symbolSize: getTagSize(TagMap[tags[i].name].length),
        itemStyle: {
          color: COLOR.r1A,
        },
        category: "Tag",
      });
      link.push({
        target: tags[i].name,
        source: name,
        category: "Link",
        count: tags[i].count || "1",
      });
    }

    // 外圈anime
    for (let i = 1; i <= len; i++) {
      let tag = data[i];
      let linkedAnime = TagMap[tag.name].concat();
      let len = Math.min(linkedAnime.length, ROUNDNUM2);
      for (let j = 0; j < len && linkedAnime.length > 0; j++) {
        // 随机取一个anime
        let randomIndex = Math.floor(Math.random() * linkedAnime.length);
        let anime = linkedAnime[randomIndex]; // 取随机anime
        linkedAnime.splice(randomIndex, 1); // 删除已选中的anime
        // 如果anime未添加，则加入
        if (data.find((item) => item.name === anime.name) === undefined) {
          data.push({
            name: anime.name,
            draggable: true,
            symbolSize: getAnimeSize(anime.rating.total),
            itemStyle: {
              color: COLOR.r2A,
            },
            symbol: "image://" + anime.images?.large,
            symbolKeepAspect: true,
            label: { show: false },
            category: "番剧",
          });
        }
        // 添加link
        link.push({
          target: anime.name,
          source: tag.name,
          category: "Link",
          count: anime.tags.find((item) => item.name === tag.map)?.count || "1",
        });
      }
    }
  } else {
    // tag中心

    let name = focus;
    // 中心tag
    data.push({
      name: name,
      draggable: false,
      symbolSize: getTagSize(TagMap[name].length),
      itemStyle: {
        color: COLOR.centerT,
      },
      category: "Tag",
      fixed: true,
      x: x / 2,
      y: y / 2,
    });

    // 外圈Anime
    let animes = TagMap[name].concat();
    let len = Math.min(animes.length, ROUNDNUM1);
    for (let i = 0; i < len && animes.length > 0; i++) {
      // 随机取一个anime
      let randomIndex = Math.floor(Math.random() * animes.length);
      let anime = animes[randomIndex]; // 取随机anime
      animes.splice(randomIndex, 1); // 删除已选中的anime
      data.push({
        name: anime.name,
        draggable: true,
        symbolSize: getAnimeSize(anime.rating.total),
        itemStyle: {
          color: COLOR.r1T,
        },
        symbol: "image://" + anime.images?.large,
        symbolKeepAspect: true,
        label: { show: false },
        category: "番剧",
      });
      // 添加link
      link.push({
        target: anime.name,
        source: name,
        category: "Link",
        count: anime.tags.find((item) => item.name === name)?.count || "1",
      });
    }

    // 外圈tag
    for (let i = 1; i <= len; i++) {
      let anime = AnimeMap[data[i].name];
      let linkedTag = anime.tags.concat();
      let len = Math.min(linkedTag.length, ROUNDNUM2);
      for (let j = 0; j < len && linkedTag.length > 0; j++) {
        let tag = linkedTag[j];
        // 如果tag未添加，则加入
        if (data.find((item) => item.name === tag.name) === undefined) {
          data.push({
            name: tag.name,
            draggable: true,
            symbolSize: getTagSize(TagMap[tag.name].length),
            itemStyle: {
              color: COLOR.r2T,
            },
            category: "Tag",
          });
        }
        // 添加link
        link.push({
          target: tag.name,
          source: anime.name,
          category: "Link",
          count: tag.count || "1",
        });
      }
    }
  }

  return [data, link];
}

function getAnimeSize(total) {
  let base = 60;
  let weight = 0.01;
  return [total * weight + base, total * weight + base];
}

function getTagSize(count) {
  let base = 20;
  return [Math.sqrt(count) * 2 + base, Math.sqrt(count) + base];
}
