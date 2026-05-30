// 香港中國語文課程大綱 (P1-F3)
// 參照香港教育局中國語文課程指引（小一至中三）

const chineseCurriculum = [
  // ===== 小一 (P1, Level 1) =====
  // 閱讀
  { grade: 'p1', curriculumLevel: 1, domain: '閱讀', strand: 'CH1', topic: '識字與認讀', edbRef: 'CH1-1',
    learningObjectives: ['認識常用漢字的字形和字義', '掌握基本筆畫和筆順', '運用部件和結構分析漢字'] },
  { grade: 'p1', curriculumLevel: 1, domain: '閱讀', strand: 'CH1', topic: '朗讀與理解', edbRef: 'CH1-2',
    learningObjectives: ['正確、流利地朗讀課文', '理解簡單句子的意思', '從圖畫和文字中提取資訊'] },
  // 寫作
  { grade: 'p1', curriculumLevel: 1, domain: '寫作', strand: 'CH1', topic: '漢字書寫', edbRef: 'CH1-3',
    learningObjectives: ['掌握正確的執筆方法和書寫姿勢', '按筆順規則書寫漢字', '書寫工整、結構勻稱'] },
  // 聆聽
  { grade: 'p1', curriculumLevel: 1, domain: '聆聽', strand: 'CH1', topic: '聆聽與回應', edbRef: 'CH1-4',
    learningObjectives: ['聽懂教師的指示和提問', '專注聆聽簡單故事和短文', '按聽到的內容作出簡單回應'] },
  // 說話
  { grade: 'p1', curriculumLevel: 1, domain: '說話', strand: 'CH1', topic: '口語表達', edbRef: 'CH1-5',
    learningObjectives: ['用完整句子回答問題', '說出圖畫的內容', '學習正確發音和咬字'] },
  { grade: 'p1', curriculumLevel: 1, domain: '說話', strand: 'CH1', topic: '看圖說故事', edbRef: 'CH1-6',
    learningObjectives: ['觀察圖畫說出故事大意', '按圖畫順序說出簡單故事', '用適當的語氣和表情說故事'] },
  // 品德情意
  { grade: 'p1', curriculumLevel: 1, domain: '品德情意', strand: 'CH1', topic: '品德故事', edbRef: 'CH1-7',
    learningObjectives: ['從故事中認識基本品德', '學習禮貌用語和待人態度', '培養愛護家人的觀念'] },

  // ===== 小二 (P2, Level 2) =====
  // 閱讀
  { grade: 'p2', curriculumLevel: 2, domain: '閱讀', strand: 'CH2', topic: '詞彙認識', edbRef: 'CH2-1',
    learningObjectives: ['擴充常用詞彙量', '認識詞語的搭配和運用', '理解近義詞和反義詞'] },
  { grade: 'p2', curriculumLevel: 2, domain: '閱讀', strand: 'CH2', topic: '短文理解', edbRef: 'CH2-2',
    learningObjectives: ['理解短文的大意和主旨', '找出短文中的關鍵資訊', '回答與短文內容相關的問題'] },
  // 寫作
  { grade: 'p2', curriculumLevel: 2, domain: '寫作', strand: 'CH2', topic: '句子寫作', edbRef: 'CH2-3',
    learningObjectives: ['寫出完整、通順的句子', '運用常用標點符號', '學習用詞造句'] },
  // 聆聽
  { grade: 'p2', curriculumLevel: 2, domain: '聆聽', strand: 'CH2', topic: '聆聽故事', edbRef: 'CH2-4',
    learningObjectives: ['聽懂故事的主要情節', '記住故事中的重要細節', '複述故事的部分內容'] },
  // 說話
  { grade: 'p2', curriculumLevel: 2, domain: '說話', strand: 'CH2', topic: '日常會話', edbRef: 'CH2-5',
    learningObjectives: ['在日常情境中進行簡單對話', '清楚表達自己的需要', '學習輪流發言和禮貌回應'] },
  { grade: 'p2', curriculumLevel: 2, domain: '說話', strand: 'CH2', topic: '複述故事', edbRef: 'CH2-6',
    learningObjectives: ['按故事發展順序複述', '用自己的話說出故事大意', '加入適當的語氣和動作'] },
  // 品德情意
  { grade: 'p2', curriculumLevel: 2, domain: '品德情意', strand: 'CH2', topic: '校園生活', edbRef: 'CH2-7',
    learningObjectives: ['學習與同學相處的態度', '培養守時守規的習慣', '建立愛護校園的意識'] },

  // ===== 小三 (P3, Level 3) =====
  // 閱讀
  { grade: 'p3', curriculumLevel: 3, domain: '閱讀', strand: 'CH3', topic: '段落理解', edbRef: 'CH3-1',
    learningObjectives: ['理解段落大意和段落結構', '找出段落的主題句', '歸納段落的主要內容'] },
  { grade: 'p3', curriculumLevel: 3, domain: '閱讀', strand: 'CH3', topic: '童話與寓言', edbRef: 'CH3-2',
    learningObjectives: ['閱讀童話和寓言故事', '理解故事的寓意', '賞析故事中的角色描寫'] },
  // 寫作
  { grade: 'p3', curriculumLevel: 3, domain: '寫作', strand: 'CH3', topic: '連句成段', edbRef: 'CH3-3',
    learningObjectives: ['把句子連接成通順的段落', '學習使用連接詞', '圍繞一個主題寫出連貫的段落'] },
  // 聆聽
  { grade: 'p3', curriculumLevel: 3, domain: '聆聽', strand: 'CH3', topic: '聽取資訊', edbRef: 'CH3-4',
    learningObjectives: ['從廣播和講述中獲取資訊', '邊聽邊記錄重點', '按聽到的內容回答問題'] },
  // 說話
  { grade: 'p3', curriculumLevel: 3, domain: '說話', strand: 'CH3', topic: '看圖說故事(進階)', edbRef: 'CH3-5',
    learningObjectives: ['觀察多幅圖畫說出完整故事', '運用想像力補充故事內容', '用不同聲線扮演故事角色'] },
  { grade: 'p3', curriculumLevel: 3, domain: '說話', strand: 'CH3', topic: '簡單報告', edbRef: 'CH3-6',
    learningObjectives: ['就熟悉話題作簡單口頭報告', '清楚表達個人看法', '學習使用恰當的開場和結語'] },
  // 品德情意
  { grade: 'p3', curriculumLevel: 3, domain: '品德情意', strand: 'CH3', topic: '關愛與分享', edbRef: 'CH3-7',
    learningObjectives: ['學習關心身邊的人和事', '培養分享和合作的精神', '從文本中體會人物的情感'] },

  // ===== 小四 (P4, Level 4) =====
  // 閱讀
  { grade: 'p4', curriculumLevel: 4, domain: '閱讀', strand: 'CH4', topic: '記敘文閱讀', edbRef: 'CH4-1',
    learningObjectives: ['認識記敘文的六要素（時間、地點、人物、起因、經過、結果）', '理清記敘文的敘事線索', '概括文章的主要內容和中心思想'] },
  { grade: 'p4', curriculumLevel: 4, domain: '閱讀', strand: 'CH4', topic: '修辭手法', edbRef: 'CH4-2',
    learningObjectives: ['認識比喻、擬人等修辭手法', '在閱讀中辨識修辭手法', '體會修辭手法的表達效果'] },
  // 寫作
  { grade: 'p4', curriculumLevel: 4, domain: '寫作', strand: 'CH4', topic: '段落結構', edbRef: 'CH4-3',
    learningObjectives: ['認識文章的基本結構（開頭、主體、結尾）', '學習按時間順序組織材料', '寫出內容具體的記敘段落'] },
  { grade: 'p4', curriculumLevel: 4, domain: '寫作', strand: 'CH4', topic: '描寫技巧', edbRef: 'CH4-4',
    learningObjectives: ['學習運用五官觀察進行描寫', '描寫人物的外貌和動作', '運用形容詞使文章更生動'] },
  // 聆聽
  { grade: 'p4', curriculumLevel: 4, domain: '聆聽', strand: 'CH4', topic: '聽講筆記', edbRef: 'CH4-5',
    learningObjectives: ['聆聽講座或說明時記錄重點', '分辨主要內容和補充資訊', '整理聽到的資料並簡要複述'] },
  // 說話
  { grade: 'p4', curriculumLevel: 4, domain: '說話', strand: 'CH4', topic: '口頭報告', edbRef: 'CH4-6',
    learningObjectives: ['就指定話題作有組織的口頭報告', '運用恰當的語言和體態', '回答聽眾的提問'] },
  // 品德情意
  { grade: 'p4', curriculumLevel: 4, domain: '品德情意', strand: 'CH4', topic: '誠信與責任', edbRef: 'CH4-7',
    learningObjectives: ['從閱讀材料中認識誠信的重要', '學習勇於承擔責任', '培養尊重他人的態度'] },

  // ===== 小五 (P5, Level 5) =====
  // 閱讀
  { grade: 'p5', curriculumLevel: 5, domain: '閱讀', strand: 'CH5', topic: '說明文閱讀', edbRef: 'CH5-1',
    learningObjectives: ['認識說明文的結構和特點', '辨識常見的說明方法（舉例、比較、數字說明等）', '從說明文中獲取和整理資訊'] },
  { grade: 'p5', curriculumLevel: 5, domain: '閱讀', strand: 'CH5', topic: '閱讀策略', edbRef: 'CH5-2',
    learningObjectives: ['運用預測、提問等閱讀策略', '聯繫已有知識理解文本', '閱讀時進行批註和筆記'] },
  // 寫作
  { grade: 'p5', curriculumLevel: 5, domain: '寫作', strand: 'CH5', topic: '描寫文寫作', edbRef: 'CH5-3',
    learningObjectives: ['運用場景描寫營造氣氛', '綜合運用人物描寫方法', '恰當使用修辭手法增強表達效果'] },
  // 聆聽
  { grade: 'p5', curriculumLevel: 5, domain: '聆聽', strand: 'CH5', topic: '聽取觀點', edbRef: 'CH5-4',
    learningObjectives: ['從廣播或演講中理解說話者的觀點', '分辨事實和意見', '評價聽到的內容是否合理'] },
  // 說話
  { grade: 'p5', curriculumLevel: 5, domain: '說話', strand: 'CH5', topic: '小組討論', edbRef: 'CH5-5',
    learningObjectives: ['參與小組討論並有序地表達觀點', '學會支持或反駁他人論點', '在討論中學習尊重不同意見'] },
  { grade: 'p5', curriculumLevel: 5, domain: '說話', strand: 'CH5', topic: '講故事', edbRef: 'CH5-6',
    learningObjectives: ['有條理地講述完整故事', '運用語調和表情增強感染力', '即興發揮補充故事細節'] },
  // 品德情意
  { grade: 'p5', curriculumLevel: 5, domain: '品德情意', strand: 'CH5', topic: '感恩與尊重', edbRef: 'CH5-7',
    learningObjectives: ['從閱讀中學習感恩的品德', '尊重不同文化背景的人', '欣賞和包容不同意見'] },

  // ===== 小六 (P6, Level 6) =====
  // 閱讀
  { grade: 'p6', curriculumLevel: 6, domain: '閱讀', strand: 'CH6', topic: '議論文閱讀', edbRef: 'CH6-1',
    learningObjectives: ['認識議論文的基本結構（論點、論據、論證）', '辨識作者的立場和觀點', '評價論據是否充分和恰當'] },
  { grade: 'p6', curriculumLevel: 6, domain: '閱讀', strand: 'CH6', topic: '綜合閱讀', edbRef: 'CH6-2',
    learningObjectives: ['閱讀不同體裁的文章', '比較不同文章的寫作手法', '綜合多篇文章的資訊進行分析'] },
  // 寫作
  { grade: 'p6', curriculumLevel: 6, domain: '寫作', strand: 'CH6', topic: '話題寫作', edbRef: 'CH6-3',
    learningObjectives: ['就指定話題確立觀點', '選用恰當的材料支撐觀點', '組織文章結構，首尾呼應'] },
  // 聆聽
  { grade: 'p6', curriculumLevel: 6, domain: '聆聽', strand: 'CH6', topic: '聽辨與評價', edbRef: 'CH6-4',
    learningObjectives: ['聆聽辯論或訪談，辨析不同觀點', '評價論據的邏輯性和說服力', '歸納不同立場的主要論點'] },
  // 說話
  { grade: 'p6', curriculumLevel: 6, domain: '說話', strand: 'CH6', topic: '討論與辯論', edbRef: 'CH6-5',
    learningObjectives: ['就議題進行有組織的辯論', '有理有據地表達和捍衛觀點', '學習運用反問和舉例增強說服力'] },
  { grade: 'p6', curriculumLevel: 6, domain: '說話', strand: 'CH6', topic: '即席演說', edbRef: 'CH6-6',
    learningObjectives: ['就熟悉話題即席組織內容演說', '控制語速、音量和停頓', '自信地與聽眾進行目光交流'] },
  // 品德情意
  { grade: 'p6', curriculumLevel: 6, domain: '品德情意', strand: 'CH6', topic: '自省與成長', edbRef: 'CH6-7',
    learningObjectives: ['從閱讀中反思個人成長經歷', '培養堅毅和自律的品格', '建立服務社會和關懷他人的意識'] },

  // ===== 中一 (F1, Level 7) =====
  // 閱讀
  { grade: 'f1', curriculumLevel: 7, domain: '閱讀', strand: 'CH7', topic: '文言文基礎', edbRef: 'CH7-1',
    learningObjectives: ['認識文言文與白話文的分別', '理解常見文言實詞的意義', '閱讀淺易文言文，理解大意'] },
  { grade: 'f1', curriculumLevel: 7, domain: '閱讀', strand: 'CH7', topic: '現代文學賞析', edbRef: 'CH7-2',
    learningObjectives: ['閱讀不同類型的現代文學作品', '體會作者的思想感情', '分析作品的人物形象和情節安排'] },
  // 寫作
  { grade: 'f1', curriculumLevel: 7, domain: '寫作', strand: 'CH7', topic: '記敘文寫作', edbRef: 'CH7-3',
    learningObjectives: ['運用順敘、倒敘等記敘方法', '在記敘中融入描寫和抒情', '確立中心思想，選取典型材料'] },
  { grade: 'f1', curriculumLevel: 7, domain: '寫作', strand: 'CH7', topic: '說明文寫作', edbRef: 'CH7-4',
    learningObjectives: ['運用恰當的說明方法介紹事物', '安排說明文的層次結構', '語言準確、簡明、有條理'] },
  // 聆聽
  { grade: 'f1', curriculumLevel: 7, domain: '聆聽', strand: 'CH7', topic: '廣播與演講聆聽', edbRef: 'CH7-5',
    learningObjectives: ['聽懂廣播節目和演講的主旨', '記錄關鍵資訊和重點論述', '歸納和整理聽到的內容'] },
  // 說話
  { grade: 'f1', curriculumLevel: 7, domain: '說話', strand: 'CH7', topic: '演講與朗誦', edbRef: 'CH7-6',
    learningObjectives: ['就指定題目作有準備的演講', '掌握朗誦的節奏、語調和感情', '恰當運用體態語和目光接觸'] },

  // ===== 中二 (F2, Level 8) =====
  // 閱讀
  { grade: 'f2', curriculumLevel: 8, domain: '閱讀', strand: 'CH8', topic: '文言文進階', edbRef: 'CH8-1',
    learningObjectives: ['理解常見文言虛詞的用法（之、乎、者、也、而等）', '閱讀較長的文言文篇章', '翻譯文言文為白話文'] },
  { grade: 'f2', curriculumLevel: 8, domain: '閱讀', strand: 'CH8', topic: '古代詩詞賞析', edbRef: 'CH8-2',
    learningObjectives: ['朗讀和背誦經典古詩詞', '理解詩詞中的意象和情感', '初步賞析詩詞的語言特色和表現手法'] },
  // 寫作
  { grade: 'f2', curriculumLevel: 8, domain: '寫作', strand: 'CH8', topic: '議論文寫作', edbRef: 'CH8-3',
    learningObjectives: ['確立論點並選用恰當論據', '學習基本的論證方法', '寫出結構完整的議論文'] },
  { grade: 'f2', curriculumLevel: 8, domain: '寫作', strand: 'CH8', topic: '實用文寫作', edbRef: 'CH8-4',
    learningObjectives: ['掌握書信、啟事等實用文的格式', '根據目的和對象選擇恰當語體', '內容具體、格式規範'] },
  // 聆聽
  { grade: 'f2', curriculumLevel: 8, domain: '聆聽', strand: 'CH8', topic: '新聞與訪談聆聽', edbRef: 'CH8-5',
    learningObjectives: ['聽懂新聞報導的主要事實和觀點', '從訪談中提取關鍵資訊和立場', '比較不同媒體對同一事件的報導'] },
  // 說話
  { grade: 'f2', curriculumLevel: 8, domain: '說話', strand: 'CH8', topic: '專題研習匯報', edbRef: 'CH8-6',
    learningObjectives: ['就專題研習成果作口頭匯報', '有條理地展示研究發現', '回應同學和老師的提問和質詢'] },

  // ===== 中三 (F3, Level 9) =====
  // 閱讀
  { grade: 'f3', curriculumLevel: 9, domain: '閱讀', strand: 'CH9', topic: '古典小說閱讀', edbRef: 'CH9-1',
    learningObjectives: ['閱讀中國古典小說選段', '分析小說的人物塑造和情節設計', '理解作品的文化背景和思想內涵'] },
  { grade: 'f3', curriculumLevel: 9, domain: '閱讀', strand: 'CH9', topic: '多文本閱讀', edbRef: 'CH9-2',
    learningObjectives: ['圍繞同一主題閱讀多篇不同文本', '比較不同作者的觀點和寫作風格', '綜合多篇文本的資訊形成個人見解'] },
  // 寫作
  { grade: 'f3', curriculumLevel: 9, domain: '寫作', strand: 'CH9', topic: '抒情文寫作', edbRef: 'CH9-3',
    learningObjectives: ['運用借景抒情、託物言志等手法', '在記事中融入真摯的情感', '語言富有感染力，層次分明'] },
  { grade: 'f3', curriculumLevel: 9, domain: '寫作', strand: 'CH9', topic: '綜合寫作', edbRef: 'CH9-4',
    learningObjectives: ['綜合運用多種表達方式', '根據讀者對象和寫作目的組織材料', '修改潤飾文章，提升表達效果'] },
  // 聆聽
  { grade: 'f3', curriculumLevel: 9, domain: '聆聽', strand: 'CH9', topic: '演說與辯論聆聽', edbRef: 'CH9-5',
    learningObjectives: ['聆聽演說和辯論，辨析論點和論據', '評價論證的邏輯性和說服力', '歸納不同立場的核心觀點和理據'] },
  // 說話
  { grade: 'f3', curriculumLevel: 9, domain: '說話', strand: 'CH9', topic: '情境說話', edbRef: 'CH9-6',
    learningObjectives: ['在不同情境中運用恰當的語體', '進行模擬訪問、會議等情境會話', '根據對象和場合調整說話方式和語氣'] },
];

export default chineseCurriculum;

// 根据年级获取课程大纲
export function getCurriculumForGrade(grade) {
  return chineseCurriculum.filter(c => c.grade === grade);
}

// 根据知识点ID查找
export function findCurriculumByEdbRef(edbRef) {
  return chineseCurriculum.find(c => c.edbRef === edbRef);
}

// 获取前置知识（同domain的低年级内容）
export function getPrerequisites(topic) {
  if (!topic?.edbRef) return [];
  const [strand, num] = topic.edbRef.split('-');
  const currentNum = parseInt(num);
  return chineseCurriculum.filter(c =>
    c.domain === topic.domain &&
    parseInt(c.edbRef.split('-')[1]) < currentNum &&
    c.topic !== topic.topic
  );
}
