// 香港小学数学课程大纲 (P1-F3)
// 参照香港教育局数学课程指引（小一至中三）

const mathCurriculum = [
  // ===== 小一 (P1, Level 1) =====
  { grade: 'p1', curriculumLevel: 1, domain: '數與代數', strand: 'N1', topic: '100以內數數', edbRef: 'N1-1',
    learningObjectives: ['認識1-100的數字', '掌握順數和倒數', '認識奇數和偶數'] },
  { grade: 'p1', curriculumLevel: 1, domain: '數與代數', strand: 'N1', topic: '加法概念', edbRef: 'N1-2',
    learningObjectives: ['理解加法意義', '20以內加法', '認識加法交換性質'] },
  { grade: 'p1', curriculumLevel: 1, domain: '數與代數', strand: 'N1', topic: '減法概念', edbRef: 'N1-3',
    learningObjectives: ['理解減法意義', '20以內減法', '加減互逆關係'] },
  { grade: 'p1', curriculumLevel: 1, domain: '度量', strand: 'M1', topic: '長度比較', edbRef: 'M1-1',
    learningObjectives: ['直接比較長短', '認識厘米(cm)'] },
  { grade: 'p1', curriculumLevel: 1, domain: '度量', strand: 'M1', topic: '時間(一)', edbRef: 'M1-2',
    learningObjectives: ['認識時鐘', '報讀整點和半點'] },
  { grade: 'p1', curriculumLevel: 1, domain: '圖形與空間', strand: 'S1', topic: '平面圖形', edbRef: 'S1-1',
    learningObjectives: ['認識正方形、長方形、三角形、圓形', '圖形分類'] },
  { grade: 'p1', curriculumLevel: 1, domain: '圖形與空間', strand: 'S1', topic: '立體圖形', edbRef: 'S1-2',
    learningObjectives: ['認識立方體、球體、圓柱體', '立體圖形分類'] },
  { grade: 'p1', curriculumLevel: 1, domain: '數據處理', strand: 'D1', topic: '統計圖表(一)', edbRef: 'D1-1',
    learningObjectives: ['認識象形圖', '資料分類和整理'] },

  // ===== 小二 (P2, Level 2) =====
  { grade: 'p2', curriculumLevel: 2, domain: '數與代數', strand: 'N2', topic: '四位數', edbRef: 'N2-1',
    learningObjectives: ['認識0-10000', '位值概念（個十百千）', '數的比較和排序'] },
  { grade: 'p2', curriculumLevel: 2, domain: '數與代數', strand: 'N2', topic: '加減法(二)', edbRef: 'N2-2',
    learningObjectives: ['兩位數加減', '三位數加減', '進位和退位'] },
  { grade: 'p2', curriculumLevel: 2, domain: '數與代數', strand: 'N2', topic: '乘法概念', edbRef: 'N2-3',
    learningObjectives: ['理解乘法意義', '2,5,10的乘法口訣', '乘法應用題'] },
  { grade: 'p2', curriculumLevel: 2, domain: '數與代數', strand: 'N2', topic: '除法概念', edbRef: 'N2-4',
    learningObjectives: ['理解除法意義（均分）', '基本除法事實', '乘除關係'] },
  { grade: 'p2', curriculumLevel: 2, domain: '度量', strand: 'M2', topic: '貨幣', edbRef: 'M2-1',
    learningObjectives: ['認識港元', '貨幣計算', '找贖問題'] },
  { grade: 'p2', curriculumLevel: 2, domain: '度量', strand: 'M2', topic: '時間(二)', edbRef: 'M2-2',
    learningObjectives: ['報讀時間（5分鐘間隔）', '時間的順序和間距'] },
  { grade: 'p2', curriculumLevel: 2, domain: '度量', strand: 'M2', topic: '長度(二)', edbRef: 'M2-3',
    learningObjectives: ['認識米(m)', '厘米和米的換算', '量度及比較長度'] },
  { grade: 'p2', curriculumLevel: 2, domain: '圖形與空間', strand: 'S2', topic: '四邊形', edbRef: 'S2-1',
    learningObjectives: ['認識正方形和長方形的特性', '繪製四邊形'] },
  { grade: 'p2', curriculumLevel: 2, domain: '數據處理', strand: 'D2', topic: '棒形圖', edbRef: 'D2-1',
    learningObjectives: ['閱讀和製作棒形圖', '資料比較'] },

  // ===== 小三 (P3, Level 3) =====
  { grade: 'p3', curriculumLevel: 3, domain: '數與代數', strand: 'N3', topic: '萬以內加減', edbRef: 'N3-1',
    learningObjectives: ['四位數加減', '加減混合運算', '應用題'] },
  { grade: 'p3', curriculumLevel: 3, domain: '數與代數', strand: 'N3', topic: '乘法(二)', edbRef: 'N3-2',
    learningObjectives: ['3,4,6,7,8,9的乘法口訣', '兩位數乘一位數'] },
  { grade: 'p3', curriculumLevel: 3, domain: '數與代數', strand: 'N3', topic: '除法(二)', edbRef: 'N3-3',
    learningObjectives: ['兩位數除以一位數', '有餘數的除法', '整除性'] },
  { grade: 'p3', curriculumLevel: 3, domain: '數與代數', strand: 'N3', topic: '分數初步', edbRef: 'N3-4',
    learningObjectives: ['認識分數', '分數比較', '同分母加減'] },
  { grade: 'p3', curriculumLevel: 3, domain: '度量', strand: 'M3', topic: '周界', edbRef: 'M3-1',
    learningObjectives: ['認識周界概念', '正方形和長方形周界', '周界應用'] },
  { grade: 'p3', curriculumLevel: 3, domain: '度量', strand: 'M3', topic: '時間(三)', edbRef: 'M3-2',
    learningObjectives: ['時間間距計算', '24小時報時制', '日/小時/分鐘換算'] },
  { grade: 'p3', curriculumLevel: 3, domain: '度量', strand: 'M3', topic: '容量和重量', edbRef: 'M3-3',
    learningObjectives: ['認識升和毫升', '認識千克和克', '容量和重量比較'] },
  { grade: 'p3', curriculumLevel: 3, domain: '圖形與空間', strand: 'S3', topic: '角', edbRef: 'S3-1',
    learningObjectives: ['認識角', '直角比對', '平面圖形的角'] },
  { grade: 'p3', curriculumLevel: 3, domain: '圖形與空間', strand: 'S3', topic: '對稱', edbRef: 'S3-2',
    learningObjectives: ['認識對稱圖形', '找出對稱軸', '繪製對稱圖形'] },
  { grade: 'p3', curriculumLevel: 3, domain: '數據處理', strand: 'D3', topic: '圖表應用', edbRef: 'D3-1',
    learningObjectives: ['閱讀各類統計圖', '製作簡單統計圖'] },

  // ===== 小四 (P4, Level 4) =====
  { grade: 'p4', curriculumLevel: 4, domain: '數與代數', strand: 'N4', topic: '多位數', edbRef: 'N4-1',
    learningObjectives: ['認識大數（萬以上）', '數的估算', '四捨五入'] },
  { grade: 'p4', curriculumLevel: 4, domain: '數與代數', strand: 'N4', topic: '乘除法(三)', edbRef: 'N4-2',
    learningObjectives: ['三位數乘一位數', '兩位數除法', '乘除混合運算'] },
  { grade: 'p4', curriculumLevel: 4, domain: '數與代數', strand: 'N4', topic: '分數(二)', edbRef: 'N4-3',
    learningObjectives: ['假分數和帶分數', '擴分和約分', '異分母比較'] },
  { grade: 'p4', curriculumLevel: 4, domain: '數與代數', strand: 'N4', topic: '小數', edbRef: 'N4-4',
    learningObjectives: ['認識小數（十分位和百分位）', '小數與分數互換', '小數加減'] },
  { grade: 'p4', curriculumLevel: 4, domain: '度量', strand: 'M4', topic: '面積', edbRef: 'M4-1',
    learningObjectives: ['認識面積概念', '正方形和長方形面積', '平方厘米'] },
  { grade: 'p4', curriculumLevel: 4, domain: '度量', strand: 'M4', topic: '長度和距離', edbRef: 'M4-2',
    learningObjectives: ['認識公里(km)', '米和公里的換算', '量度距離'] },
  { grade: 'p4', curriculumLevel: 4, domain: '圖形與空間', strand: 'S4', topic: '三角形', edbRef: 'S4-1',
    learningObjectives: ['按角分類三角形', '三角形特性', '繪製三角形'] },
  { grade: 'p4', curriculumLevel: 4, domain: '圖形與空間', strand: 'S4', topic: '方向', edbRef: 'S4-2',
    learningObjectives: ['認識八個方向', '方向描述位置'] },

  // ===== 小五 (P5, Level 5) =====
  { grade: 'p5', curriculumLevel: 5, domain: '數與代數', strand: 'N5', topic: '分數(三)', edbRef: 'N5-1',
    learningObjectives: ['異分母加減', '分數乘法', '分數除法'] },
  { grade: 'p5', curriculumLevel: 5, domain: '數與代數', strand: 'N5', topic: '小數(二)', edbRef: 'N5-2',
    learningObjectives: ['三位小數', '小數乘法', '小數除法'] },
  { grade: 'p5', curriculumLevel: 5, domain: '數與代數', strand: 'N5', topic: '百分數', edbRef: 'N5-3',
    learningObjectives: ['認識百分數', '百分數與分數互換', '百分數應用'] },
  { grade: 'p5', curriculumLevel: 5, domain: '度量', strand: 'M5', topic: '體積', edbRef: 'M5-1',
    learningObjectives: ['認識體積概念', '正方體和長方體體積', '立方厘米'] },
  { grade: 'p5', curriculumLevel: 5, domain: '度量', strand: 'M5', topic: '速率', edbRef: 'M5-2',
    learningObjectives: ['認識速率概念', '速度計算', '距離和時間關係'] },
  { grade: 'p5', curriculumLevel: 5, domain: '圖形與空間', strand: 'S5', topic: '多邊形面積', edbRef: 'S5-1',
    learningObjectives: ['平行四邊形面積', '三角形面積', '梯形面積'] },
  { grade: 'p5', curriculumLevel: 5, domain: '圖形與空間', strand: 'S5', topic: '圓', edbRef: 'S5-2',
    learningObjectives: ['認識圓的特性', '圓周和直徑', '圓周率π'] },

  // ===== 小六 (P6, Level 6) =====
  { grade: 'p6', curriculumLevel: 6, domain: '數與代數', strand: 'N6', topic: '小數和分數混合', edbRef: 'N6-1',
    learningObjectives: ['混合四則運算', '應用題解難'] },
  { grade: 'p6', curriculumLevel: 6, domain: '數與代數', strand: 'N6', topic: '百分數(二)', edbRef: 'N6-2',
    learningObjectives: ['折扣和盈利', '稅務和利率', '百分數應用題'] },
  { grade: 'p6', curriculumLevel: 6, domain: '數與代數', strand: 'N6', topic: '比和率', edbRef: 'N6-3',
    learningObjectives: ['認識比和率', '比例應用', '正比例'] },
  { grade: 'p6', curriculumLevel: 6, domain: '度量', strand: 'M6', topic: '圓面積和圓周', edbRef: 'M6-1',
    learningObjectives: ['圓面積公式', '圓周計算', '圓的應用題'] },
  { grade: 'p6', curriculumLevel: 6, domain: '度量', strand: 'M6', topic: '立體圖形體積', edbRef: 'M6-2',
    learningObjectives: ['圓柱體積', '立體圖形截面', '體積應用'] },
  { grade: 'p6', curriculumLevel: 6, domain: '數據處理', strand: 'D6', topic: '統計應用', edbRef: 'D6-1',
    learningObjectives: ['平均數', '統計圖選擇和製作', '數據分析'] },
  { grade: 'p6', curriculumLevel: 6, domain: '代數', strand: 'A6', topic: '代數初步', edbRef: 'A6-1',
    learningObjectives: ['認識代數符號', '簡易方程'] },

  // ===== 中一 (F1, Level 7) =====
  { grade: 'f1', curriculumLevel: 7, domain: '數與代數', strand: 'A1', topic: '負數', edbRef: 'A1-1',
    learningObjectives: ['認識負數', '數線', '整數加減'] },
  { grade: 'f1', curriculumLevel: 7, domain: '數與代數', strand: 'A1', topic: '代數式', edbRef: 'A1-2',
    learningObjectives: ['代數式的化簡', '代入法', '簡易方程求解'] },
  { grade: 'f1', curriculumLevel: 7, domain: '數與代數', strand: 'A1', topic: '整數運算', edbRef: 'A1-3',
    learningObjectives: ['整數四則運算', '指數記法', '質因數分解'] },
  { grade: 'f1', curriculumLevel: 7, domain: '度量、圖形與空間', strand: 'G1', topic: '幾何基礎', edbRef: 'G1-1',
    learningObjectives: ['點線面概念', '角的分類和量度', '平行和垂直'] },
  { grade: 'f1', curriculumLevel: 7, domain: '度量、圖形與空間', strand: 'G1', topic: '面積和體積(二)', edbRef: 'G1-2',
    learningObjectives: ['多邊形面積進階', '立體圖形表面積', '單位換算'] },
  { grade: 'f1', curriculumLevel: 7, domain: '數據處理', strand: 'D1', topic: '統計圖表(二)', edbRef: 'D1-1',
    learningObjectives: ['乾葉圖', '散點圖', '數據集中趨勢'] },

  // ===== 中二 (F2, Level 8) =====
  { grade: 'f2', curriculumLevel: 8, domain: '數與代數', strand: 'A2', topic: '一元一次方程', edbRef: 'A2-1',
    learningObjectives: ['解一元一次方程', '方程應用題', '不等式'] },
  { grade: 'f2', curriculumLevel: 8, domain: '數與代數', strand: 'A2', topic: '多項式', edbRef: 'A2-2',
    learningObjectives: ['多項式加減乘', '因式分解(提取公因式)', '恆等式'] },
  { grade: 'f2', curriculumLevel: 8, domain: '數與代數', strand: 'A2', topic: '比率和比例', edbRef: 'A2-3',
    learningObjectives: ['比例應用題', '百分變化', '正反比例'] },
  { grade: 'f2', curriculumLevel: 8, domain: '度量、圖形與空間', strand: 'G2', topic: '畢氏定理', edbRef: 'G2-1',
    learningObjectives: ['認識畢氏定理', '直角三角形的邊長關係', '定理應用'] },
  { grade: 'f2', curriculumLevel: 8, domain: '度量、圖形與空間', strand: 'G2', topic: '三角學初步', edbRef: 'G2-2',
    learningObjectives: ['正弦、餘弦、正切', '三角比的應用'] },
  { grade: 'f2', curriculumLevel: 8, domain: '度量、圖形與空間', strand: 'G2', topic: '幾何證明', edbRef: 'G2-3',
    learningObjectives: ['三角形全等', '對應角', '平行線性質'] },

  // ===== 中三 (F3, Level 9) =====
  { grade: 'f3', curriculumLevel: 9, domain: '數與代數', strand: 'A3', topic: '二次方程', edbRef: 'A3-1',
    learningObjectives: ['因式分解法解二次方程', '二次方程公式', '應用題'] },
  { grade: 'f3', curriculumLevel: 9, domain: '數與代數', strand: 'A3', topic: '函數概念', edbRef: 'A3-2',
    learningObjectives: ['認識函數', '函數圖像', '線性函數'] },
  { grade: 'f3', curriculumLevel: 9, domain: '數與代數', strand: 'A3', topic: '坐標幾何', edbRef: 'A3-3',
    learningObjectives: ['直角坐標系', '直線斜率', '兩點距離'] },
  { grade: 'f3', curriculumLevel: 9, domain: '度量、圖形與空間', strand: 'G3', topic: '圓形幾何', edbRef: 'G3-1',
    learningObjectives: ['圓的基本性質', '圓心角和圓周角', '弦和弧'] },
  { grade: 'f3', curriculumLevel: 9, domain: '度量、圖形與空間', strand: 'G3', topic: '面積和體積(三)', edbRef: 'G3-2',
    learningObjectives: ['球體和錐體', '立體圖形截面', '體積和表面積進階'] },
  { grade: 'f3', curriculumLevel: 9, domain: '數據處理', strand: 'D3', topic: '概率', edbRef: 'D3-1',
    learningObjectives: ['認識概率', '實驗概率', '概率應用'] },
];

export default mathCurriculum;

// 根据年级获取课程大纲
export function getCurriculumForGrade(grade) {
  return mathCurriculum.filter(c => c.grade === grade);
}

// 根据知识点ID查找
export function findCurriculumByEdbRef(edbRef) {
  return mathCurriculum.find(c => c.edbRef === edbRef);
}

// 获取前置知识（同domain同topic的低年级内容）
export function getPrerequisites(topic) {
  if (!topic?.edbRef) return [];
  const [strand, num] = topic.edbRef.split('-');
  const currentNum = parseInt(num);
  return mathCurriculum.filter(c =>
    c.strand === strand &&
    parseInt(c.edbRef.split('-')[1]) < currentNum &&
    c.topic !== topic.topic
  );
}
