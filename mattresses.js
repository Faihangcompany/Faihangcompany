const mattresses = [
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "紅寶竹纖維健脊床褥",
    "hardness_desc": "硬",
    "hardness_value": 6.5,
    "thickness": 8.5,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/紅寶竹纖維/",
    "note": "竹纖維面布，吸濕排毒。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "健脊9002 MK2特硬床褥",
    "hardness_desc": "硬",
    "hardness_value": 6.5,
    "thickness": 8.5,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/健脊9002-mk2/",
    "note": "特硬護脊，支撐力強。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "Diamond IPC 星鑽 獨立袋裝彈簧床褥",
    "hardness_desc": "適中",
    "hardness_value": 4.5,
    "thickness": 10,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/diamond-ipc-星鑽/",
    "note": "獨立袋裝彈簧，減少震動傳達。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "天絲寶 健脊床褥",
    "hardness_desc": "適中偏硬",
    "hardness_value": 5.3,
    "thickness": 6.5,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/天絲寶/",
    "note": "天絲面布，透氣舒適。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "薄裝護脊 床褥",
    "hardness_desc": "適中偏硬",
    "hardness_value": 5,
    "thickness": 5.5,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/薄裝護脊/",
    "note": "適合高架床或子母床。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "I.P.C.輕盈 獨立袋裝彈簧床褥",
    "hardness_desc": "適中",
    "hardness_value": 3.9,
    "thickness": 4.7,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/ipc輕盈/",
    "note": "輕便超薄獨立芯，適合多種床款。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "小睡星 超薄健康床褥",
    "hardness_desc": "適中",
    "hardness_value": 4.0,
    "thickness": 4.7,
    "gift": "此型號暫無贈品。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/小睡星/",
    "note": "經濟實惠之選。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "星夢銀離子 健康床褥",
    "hardness_desc": "適中",
    "hardness_value": 4.6,
    "thickness": 8.5,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/星夢銀離子/",
    "note": "銀離子抗菌面布。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "Magic三段式 獨立袋裝彈簧護脊床褥",
    "hardness_desc": "適中偏硬",
    "hardness_value": 4.5,
    "thickness": 8.5,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/magic三段式/",
    "note": "三段式承托設計。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "2000 Plus 健康床褥 MK2",
    "hardness_desc": "適中偏硬",
    "hardness_value": 5.5,
    "thickness": 8,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/2000-plus/",
    "note": "經典健脊型號。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "星悅獨立袋裝彈簧床褥",
    "hardness_desc": "適中",
    "hardness_value": 4.2,
    "thickness": 9.5,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/星悅/",
    "note": "舒適回彈。免費送貨🚚。"
  },
  {
    "brand": "歐化寶 Ulfenbo",
    "name": "冰藍薄裝護脊獨立袋裝彈簧床褥",
    "hardness_desc": "適中",
    "hardness_value": 4.0,
    "thickness": 6,
    "gift": "指定單人送記憶枕/甜睡枕1個；雙人送羊毛被/冷暖被1張或記憶枕/甜睡枕2個。",
    "link": "https://www.ulfenbo.com.hk/產品/床褥/冰藍/",
    "note": "涼感面布，適合香港天氣。免費送貨🚚。"
  }
];

export default mattresses;
