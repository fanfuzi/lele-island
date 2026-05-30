// 香港粵語課程大綱 (P1-F3)
// 參照香港教育局中文課程指引及實用粵語溝通能力指標

const cantoneseCurriculum = [
  // ===== 小一 (P1, Level 1) =====
  { grade: 'p1', curriculumLevel: 1, domain: '日常會話', strand: 'CT1-1', topic: '打招呼', edbRef: 'CT1-1',
    learningObjectives: ['能夠用粵語問好', '能夠介紹自己名字', '能夠回應簡單的問候語'] },
  { grade: 'p1', curriculumLevel: 1, domain: '日常會話', strand: 'CT1-2', topic: '數字與數數', edbRef: 'CT1-2',
    learningObjectives: ['能夠用粵語數一至十', '能夠報出自己的年齡', '能夠用粵語說出電話號碼'] },
  { grade: 'p1', curriculumLevel: 1, domain: '日常會話', strand: 'CT1-3', topic: '家庭稱謂', edbRef: 'CT1-3',
    learningObjectives: ['能夠說出常見家庭成員稱呼', '能夠簡單介紹家人', '能夠正確使用量詞「個」'] },
  { grade: 'p1', curriculumLevel: 1, domain: '學校用語', strand: 'CT1-4', topic: '課堂用語', edbRef: 'CT1-4',
    learningObjectives: ['能夠聽懂老師常用指令', '能夠舉手回答問題', '能夠說出「唔該」和「多謝」'] },
  { grade: 'p1', curriculumLevel: 1, domain: '學校用語', strand: 'CT1-5', topic: '學校場所', edbRef: 'CT1-5',
    learningObjectives: ['能夠說出學校常見場所名稱', '能夠用粵語問路去洗手間', '能夠描述教室裏的基本物品'] },
  { grade: 'p1', curriculumLevel: 1, domain: '社交禮儀', strand: 'CT1-6', topic: '禮貌用語', edbRef: 'CT1-6',
    learningObjectives: ['能夠說「唔該」、「對不起」、「唔好意思」', '能夠在合適場合說禮貌語', '能夠主動向長輩問好'] },

  // ===== 小二 (P2, Level 2) =====
  { grade: 'p2', curriculumLevel: 2, domain: '日常會話', strand: 'CT2-1', topic: '時間表達', edbRef: 'CT2-1',
    learningObjectives: ['能夠用粵語說出今日、聽日、尋日', '能夠說出幾點鐘', '能夠描述簡單的日常作息時間'] },
  { grade: 'p2', curriculumLevel: 2, domain: '日常會話', strand: 'CT2-2', topic: '食物與餐飲', edbRef: 'CT2-2',
    learningObjectives: ['能夠說出常見食物名稱', '能夠表達自己想食咩', '能夠在茶餐廳簡單落單'] },
  { grade: 'p2', curriculumLevel: 2, domain: '日常會話', strand: 'CT2-3', topic: '天氣與衣着', edbRef: 'CT2-3',
    learningObjectives: ['能夠描述天氣狀況', '能夠說出四季特徵', '能夠根據天氣講出穿咩衫'] },
  { grade: 'p2', curriculumLevel: 2, domain: '學校用語', strand: 'CT2-4', topic: '學習用品', edbRef: 'CT2-4',
    learningObjectives: ['能夠說出文具名稱', '能夠用粵語借嘢', '能夠描述物品嘅顏色同形狀'] },
  { grade: 'p2', curriculumLevel: 2, domain: '社交禮儀', strand: 'CT2-5', topic: '電話對話', edbRef: 'CT2-5',
    learningObjectives: ['能夠接聽電話並自我介紹', '能夠用粵語留口訊', '能夠正確使用電話禮貌語'] },
  { grade: 'p2', curriculumLevel: 2, domain: '香港文化', strand: 'CT2-6', topic: '節日與慶祝', edbRef: 'CT2-6',
    learningObjectives: ['能夠說出新年、中秋節等傳統節日', '能夠描述節日習俗', '能夠說出簡單的節日祝福語'] },

  // ===== 小三 (P3, Level 3) =====
  { grade: 'p3', curriculumLevel: 3, domain: '日常會話', strand: 'CT3-1', topic: '問路與交通', edbRef: 'CT3-1',
    learningObjectives: ['能夠用粵語問路', '能夠說出常見交通工具名稱', '能夠描述簡單嘅路線'] },
  { grade: 'p3', curriculumLevel: 3, domain: '日常會話', strand: 'CT3-2', topic: '購物對話', edbRef: 'CT3-2',
    learningObjectives: ['能夠在商店問價錢', '能夠講出想買咩', '能夠簡單討價還價'] },
  { grade: 'p3', curriculumLevel: 3, domain: '學校用語', strand: 'CT3-3', topic: '描述活動', edbRef: 'CT3-3',
    learningObjectives: ['能夠描述學校活動', '能夠講出自己嘅興趣', '能夠邀請同學一齊玩'] },
  { grade: 'p3', curriculumLevel: 3, domain: '社交禮儀', strand: 'CT3-4', topic: '做客禮儀', edbRef: 'CT3-4',
    learningObjectives: ['能夠到訪朋友屋企時使用得體用語', '能夠接受同拒絕邀請', '能夠表達感謝同道別'] },
  { grade: 'p3', curriculumLevel: 3, domain: '香港文化', strand: 'CT3-5', topic: '香港地標', edbRef: 'CT3-5',
    learningObjectives: ['能夠說出香港著名地標名稱', '能夠簡單描述去過嘅地方', '能夠用粵語講香港特色'] },
  { grade: 'p3', curriculumLevel: 3, domain: '日常會話', strand: 'CT3-6', topic: '身體與健康', edbRef: 'CT3-6',
    learningObjectives: ['能夠說出身體部位名稱', '能夠描述唔舒服嘅地方', '能夠去睇醫生時講出症狀'] },

  // ===== 小四 (P4, Level 4) =====
  { grade: 'p4', curriculumLevel: 4, domain: '日常會話', strand: 'CT4-1', topic: '表達意見', edbRef: 'CT4-1',
    learningObjectives: ['能夠用粵語表達自己嘅睇法', '能夠用「我覺得」、「我認為」等表達', '能夠禮貌地同意或反對'] },
  { grade: 'p4', curriculumLevel: 4, domain: '日常會話', strand: 'CT4-2', topic: '描述人物', edbRef: 'CT4-2',
    learningObjectives: ['能夠描述人嘅外貌特徵', '能夠描述人嘅性格', '能夠比較兩個人嘅分別'] },
  { grade: 'p4', curriculumLevel: 4, domain: '學校用語', strand: 'CT4-3', topic: '小組討論', edbRef: 'CT4-3',
    learningObjectives: ['能夠喺小組討論中表達意見', '能夠用粵語提議同回應', '能夠總結討論結果'] },
  { grade: 'p4', curriculumLevel: 4, domain: '社交禮儀', strand: 'CT4-4', topic: '求助與幫忙', edbRef: 'CT4-4',
    learningObjectives: ['能夠有禮貌咁請求幫忙', '能夠主動提供協助', '能夠使用「唔該」、「可唔可以」等求助語'] },
  { grade: 'p4', curriculumLevel: 4, domain: '香港文化', strand: 'CT4-5', topic: '香港美食', edbRef: 'CT4-5',
    learningObjectives: ['能夠說出香港特色小食名稱', '能夠描述食物嘅味道', '能夠用粵語介紹香港美食文化'] },
  { grade: 'p4', curriculumLevel: 4, domain: '日常會話', strand: 'CT4-6', topic: '講故事', edbRef: 'CT4-6',
    learningObjectives: ['能夠用粵語講述簡單故事', '能夠按時間順序描述事件', '能夠使用連接詞如「跟住」、「然後」'] },

  // ===== 小五 (P5, Level 5) =====
  { grade: 'p5', curriculumLevel: 5, domain: '日常會話', strand: 'CT5-1', topic: '比較與選擇', edbRef: 'CT5-1',
    learningObjectives: ['能夠用粵語比較兩件事物', '能夠講出選擇嘅原因', '能夠使用「平過」、「貴過」、「好過」等比較詞'] },
  { grade: 'p5', curriculumLevel: 5, domain: '日常會話', strand: 'CT5-2', topic: '情緒表達', edbRef: 'CT5-2',
    learningObjectives: ['能夠用粵語表達唔同情緒', '能夠描述開心、唔開心嘅原因', '能夠安慰別人'] },
  { grade: 'p5', curriculumLevel: 5, domain: '學校用語', strand: 'CT5-3', topic: '簡短演講', edbRef: 'CT5-3',
    learningObjectives: ['能夠用粵語做簡單嘅口頭報告', '能夠有條理咁表達主題', '能夠回答同學嘅提問'] },
  { grade: 'p5', curriculumLevel: 5, domain: '社交禮儀', strand: 'CT5-4', topic: '解決衝突', edbRef: 'CT5-4',
    learningObjectives: ['能夠用粵語和平解決爭執', '能夠表達自己嘅立場', '能夠協商同妥協'] },
  { grade: 'p5', curriculumLevel: 5, domain: '香港文化', strand: 'CT5-5', topic: '粵語俗語', edbRef: 'CT5-5',
    learningObjectives: ['能夠理解常用粵語俗語意思', '能夠喺合適場合使用俗語', '能夠解釋俗語背後嘅文化含義'] },
  { grade: 'p5', curriculumLevel: 5, domain: '日常會話', strand: 'CT5-6', topic: '預約與安排', edbRef: 'CT5-6',
    learningObjectives: ['能夠用粵語預約時間', '能夠安排活動計劃', '能夠更改或取消預約'] },

  // ===== 小六 (P6, Level 6) =====
  { grade: 'p6', curriculumLevel: 6, domain: '日常會話', strand: 'CT6-1', topic: '投訴與回應', edbRef: 'CT6-1',
    learningObjectives: ['能夠有禮貌咁投訴', '能夠清楚講出問題所在', '能夠恰當咁回應別人嘅投訴'] },
  { grade: 'p6', curriculumLevel: 6, domain: '日常會話', strand: 'CT6-2', topic: '電話與網上溝通', edbRef: 'CT6-2',
    learningObjectives: ['能夠用粵語喺電話中清楚表達', '能夠理解網上常用粵語縮寫', '能夠恰當咁使用語音訊息'] },
  { grade: 'p6', curriculumLevel: 6, domain: '學校用語', strand: 'CT6-3', topic: '辯論初步', edbRef: 'CT6-3',
    learningObjectives: ['能夠用粵語進行簡單辯論', '能夠提出論點同支持嘅理由', '能夠反駁對方論點'] },
  { grade: 'p6', curriculumLevel: 6, domain: '社交禮儀', strand: 'CT6-4', topic: '社交場合', edbRef: 'CT6-4',
    learningObjectives: ['能夠喺生日會、畢業禮等場合得體應對', '能夠即席發表簡單祝詞', '能夠恰當咁讚美別人'] },
  { grade: 'p6', curriculumLevel: 6, domain: '香港文化', strand: 'CT6-5', topic: '粵語與文化', edbRef: 'CT6-5',
    learningObjectives: ['能夠了解粵語嘅歷史背景', '能夠分辨書面語同口語分別', '能夠欣賞粵語歌曲同文化'] },

  // ===== 中一 (F1, Level 7) =====
  { grade: 'f1', curriculumLevel: 7, domain: '日常會話', strand: 'CT7-1', topic: '新聞時事討論', edbRef: 'CT7-1',
    learningObjectives: ['能夠用粵語討論時事新聞', '能夠表達對社會事件嘅睇法', '能夠引用事實支持自己嘅論點'] },
  { grade: 'f1', curriculumLevel: 7, domain: '日常會話', strand: 'CT7-2', topic: '計劃與目標', edbRef: 'CT7-2',
    learningObjectives: ['能夠用粵語講述自己嘅計劃', '能夠設定同表達目標', '能夠說服別人支持自己嘅計劃'] },
  { grade: 'f1', curriculumLevel: 7, domain: '學校用語', strand: 'CT7-3', topic: '專題報告', edbRef: 'CT7-3',
    learningObjectives: ['能夠用粵語做專題口頭報告', '能夠有結構咁介紹複雜主題', '能夠使用視覺輔助配合演講'] },
  { grade: 'f1', curriculumLevel: 7, domain: '社交禮儀', strand: 'CT7-4', topic: '職場溝通初探', edbRef: 'CT7-4',
    learningObjectives: ['能夠模擬簡單嘅面試對話', '能夠恰當咁介紹自己嘅能力', '能夠理解正式同非正式場合用語分別'] },
  { grade: 'f1', curriculumLevel: 7, domain: '香港文化', strand: 'CT7-5', topic: '粵語文學', edbRef: 'CT7-5',
    learningObjectives: ['能夠欣賞粵語文學作品', '能夠理解粵語口語文學特色', '能夠朗讀粵語作品並表達情感'] },
  { grade: 'f1', curriculumLevel: 7, domain: '日常會話', strand: 'CT7-6', topic: '道歉與調解', edbRef: 'CT7-6',
    learningObjectives: ['能夠真誠咁道歉', '能夠擔當朋友之間嘅調解角色', '能夠用同理心處理人際衝突'] },

  // ===== 中二 (F2, Level 8) =====
  { grade: 'f2', curriculumLevel: 8, domain: '日常會話', strand: 'CT8-1', topic: '說服與協商', edbRef: 'CT8-1',
    learningObjectives: ['能夠用粵語說服別人', '能夠喺協商中爭取合理利益', '能夠使用恰當嘅修辭技巧'] },
  { grade: 'f2', curriculumLevel: 8, domain: '日常會話', strand: 'CT8-2', topic: '文化議題討論', edbRef: 'CT8-2',
    learningObjectives: ['能夠討論中西文化差異', '能夠用粵語表達文化身份認同', '能夠尊重唔同文化觀點'] },
  { grade: 'f2', curriculumLevel: 8, domain: '學校用語', strand: 'CT8-3', topic: '辯論技巧', edbRef: 'CT8-3',
    learningObjectives: ['能夠用粵語進行正式辯論', '能夠運用邏輯推理', '能夠即時回應對方論點'] },
  { grade: 'f2', curriculumLevel: 8, domain: '社交禮儀', strand: 'CT8-4', topic: '跨代溝通', edbRef: 'CT8-4',
    learningObjectives: ['能夠理解長輩嘅表達方式', '能夠與唔同年齡層有效溝通', '能夠喺意見分歧時保持尊重'] },
  { grade: 'f2', curriculumLevel: 8, domain: '香港文化', strand: 'CT8-5', topic: '粵語傳承', edbRef: 'CT8-5',
    learningObjectives: ['能夠探討粵語嘅傳承與發展', '能夠理解粵語喺香港社會嘅角色', '能夠用粵語創作簡單內容'] },

  // ===== 中三 (F3, Level 9) =====
  { grade: 'f3', curriculumLevel: 9, domain: '日常會話', strand: 'CT9-1', topic: '公開演說', edbRef: 'CT9-1',
    learningObjectives: ['能夠用粵語進行公開演說', '能夠掌握演說嘅節奏同語調', '能夠與觀眾互動'] },
  { grade: 'f3', curriculumLevel: 9, domain: '日常會話', strand: 'CT9-2', topic: '媒體素養', edbRef: 'CT9-2',
    learningObjectives: ['能夠分析媒體資訊嘅可信度', '能夠用粵語討論媒體現象', '能夠辨識廣告同宣傳手法'] },
  { grade: 'f3', curriculumLevel: 9, domain: '學校用語', strand: 'CT9-3', topic: '模擬會議', edbRef: 'CT9-3',
    learningObjectives: ['能夠參與模擬會議', '能夠用粵語提出議案', '能夠主持簡單會議流程'] },
  { grade: 'f3', curriculumLevel: 9, domain: '社交禮儀', strand: 'CT9-4', topic: '領導與團隊', edbRef: 'CT9-4',
    learningObjectives: ['能夠喺團隊中擔當領導角色', '能夠用粵語分配任務同鼓勵隊員', '能夠有效咁主持團隊討論'] },
  { grade: 'f3', curriculumLevel: 9, domain: '香港文化', strand: 'CT9-5', topic: '粵語應用創作', edbRef: 'CT9-5',
    learningObjectives: ['能夠用粵語創作短劇或廣播劇', '能夠為唔同場合撰寫講稿', '能夠評價粵語媒體內容質素'] },
  { grade: 'f3', curriculumLevel: 9, domain: '日常會話', strand: 'CT9-6', topic: '反思與評價', edbRef: 'CT9-6',
    learningObjectives: ['能夠用粵語進行深度反思', '能夠客觀咁評價自己同別人', '能夠提出建設性意見'] },
];

export default cantoneseCurriculum;

// 根据年级获取课程大纲
export function getCurriculumForGrade(grade) {
  return cantoneseCurriculum.filter(c => c.grade === grade);
}

// 根据知识点ID查找
export function findCurriculumByEdbRef(edbRef) {
  return cantoneseCurriculum.find(c => c.edbRef === edbRef);
}

// 获取前置知识（同strand的低年级内容）
export function getPrerequisites(topic) {
  if (!topic?.edbRef) return [];
  const [strand, num] = topic.edbRef.split('-');
  const currentNum = parseInt(num);
  return cantoneseCurriculum.filter(c =>
    c.strand === strand &&
    parseInt(c.edbRef.split('-')[1]) < currentNum &&
    c.topic !== topic.topic
  );
}

export { cantoneseCurriculum };
