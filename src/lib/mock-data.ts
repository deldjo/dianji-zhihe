// Mock data for 典籍智核·文脉探微

export interface Dynasty {
  id: string;
  name: string;
  period: string;
}

export interface Figure {
  id: string;
  name: string;
  courtesyName?: string;
  pseudonym?: string;
  dynasty: string;
  birthYear: number;
  deathYear: number;
  identity: string[];
  tags: string[];
  bio: string;
  avatar?: string;
}

export interface Relation {
  source: string;
  target: string;
  type: '师友' | '亲属' | '政治' | '文学' | '对手';
  description: string;
}

export interface TimelineEvent {
  year: number;
  age: number;
  title: string;
  description: string;
  location?: string;
  type: '仕途' | '文学' | '生活' | '政治' | '游历';
}

export interface Poem {
  title: string;
  content: string;
  year?: number;
  location?: string;
  background?: string;
  tags: string[];
}

export interface TrajectoryPoint {
  year: number;
  location: string;
  lng: number;
  lat: number;
  event: string;
  type: '仕途' | '流放' | '游历' | '故里' | '生活';
}

export const dynasties: Dynasty[] = [
  { id: 'tang', name: '唐', period: '618-907' },
  { id: 'song', name: '宋', period: '960-1279' },
  { id: 'yuan', name: '元', period: '1271-1368' },
  { id: 'ming', name: '明', period: '1368-1644' },
  { id: 'qing', name: '清', period: '1644-1912' },
];

export const figures: Figure[] = [
  {
    id: 'su-shi',
    name: '苏轼',
    courtesyName: '子瞻',
    pseudonym: '东坡居士',
    dynasty: '北宋',
    birthYear: 1037,
    deathYear: 1101,
    identity: ['文学家', '书法家', '画家', '政治家'],
    tags: ['唐宋八大家', '豪放派', '三苏', '苏黄'],
    bio: '苏轼，字子瞻，号东坡居士，眉州眉山人。北宋文学家、书法家、画家，唐宋八大家之一。与父苏洵、弟苏辙合称"三苏"，与黄庭坚并称"苏黄"，与辛弃疾并称"苏辛"。其诗题材广阔，清新豪健，善用夸张比喻，独具风格；其词开豪放一派，与辛弃疾同是豪放派代表；其散文著述宏富，豪放自如。',
  },
  {
    id: 'li-bai',
    name: '李白',
    courtesyName: '太白',
    pseudonym: '青莲居士',
    dynasty: '唐',
    birthYear: 701,
    deathYear: 762,
    identity: ['诗人', '剑客'],
    tags: ['诗仙', '浪漫主义', '饮中八仙', '竹溪六逸'],
    bio: '李白，字太白，号青莲居士，又号"谪仙人"。唐代伟大的浪漫主义诗人，被后人誉为"诗仙"，与杜甫并称"李杜"。其人爽朗大方，爱饮酒作诗，喜交友。李白深受黄老列庄思想影响，有《李太白集》传世，诗作中多以醉时写的。其诗风格豪放飘逸，想象丰富奇特，色彩瑰伟绚丽，是屈原之后最具个性特色、最伟大的浪漫主义诗人。',
  },
  {
    id: 'du-fu',
    name: '杜甫',
    courtesyName: '子美',
    pseudonym: '少陵野老',
    dynasty: '唐',
    birthYear: 712,
    deathYear: 770,
    identity: ['诗人', '官员'],
    tags: ['诗圣', '现实主义', '李杜', '大历十才子之师'],
    bio: '杜甫，字子美，自号少陵野老。唐代伟大的现实主义诗人，与李白合称"李杜"。被后人称为"诗圣"，他的诗被称为"诗史"。杜甫忧国忧民，人格高尚，诗艺精湛。他一生写下了1500多首诗，其中很多是传颂千古的名篇。',
  },
  {
    id: 'xin-qiji',
    name: '辛弃疾',
    courtesyName: '幼安',
    pseudonym: '稼轩居士',
    dynasty: '南宋',
    birthYear: 1140,
    deathYear: 1207,
    identity: ['词人', '将领', '政治家'],
    tags: ['豪放派', '苏辛', '词中之龙', '济南二安'],
    bio: '辛弃疾，原字坦夫，后改字幼安，号稼轩，山东东路济南府历城县人。南宋豪放派词人、将领，有"词中之龙"之称，与苏轼合称"苏辛"，与李清照并称"济南二安"。辛弃疾一生以恢复中原为志，以功业自许。其词热情洋溢，慷慨悲壮，笔力雄厚。',
  },
  {
    id: 'li-qingzhao',
    name: '李清照',
    courtesyName: '',
    pseudonym: '易安居士',
    dynasty: '宋',
    birthYear: 1084,
    deathYear: 1155,
    identity: ['词人', '学者'],
    tags: ['婉约派', '济南二安', '千古第一才女'],
    bio: '李清照，号易安居士，宋齐州章丘人。宋代女词人，婉约词派代表，有"千古第一才女"之称。所作词，前期多写其悠闲生活，后期多悲叹身世，情调感伤。形式上善用白描手法，自辟途径，语言清丽。',
  },
  {
    id: 'wang-anshi',
    name: '王安石',
    courtesyName: '介甫',
    pseudonym: '半山',
    dynasty: '北宋',
    birthYear: 1021,
    deathYear: 1086,
    identity: ['政治家', '文学家', '改革家'],
    tags: ['唐宋八大家', '王安石变法', '临川先生'],
    bio: '王安石，字介甫，号半山。北宋著名思想家、政治家、文学家、改革家。在文学上，王安石具有突出成就，其散文简洁峻切，短小精悍，论点鲜明，逻辑严密，有很强的说服力，充分发挥了古文的实际功用，名列"唐宋八大家"。',
  },
  {
    id: 'ou-yangxiu',
    name: '欧阳修',
    courtesyName: '永叔',
    pseudonym: '醉翁',
    dynasty: '北宋',
    birthYear: 1007,
    deathYear: 1072,
    identity: ['文学家', '史学家', '政治家'],
    tags: ['唐宋八大家', '醉翁', '诗文革新运动'],
    bio: '欧阳修，字永叔，号醉翁，晚号六一居士。北宋政治家、文学家，唐宋八大家之一。在政治上负有盛名，官至翰林学士、枢密副使、参知政事。在文学上，他领导了北宋诗文革新运动，继承并发展了韩愈的古文理论。',
  },
  {
    id: 'huang-tingjian',
    name: '黄庭坚',
    courtesyName: '鲁直',
    pseudonym: '山谷道人',
    dynasty: '北宋',
    birthYear: 1045,
    deathYear: 1105,
    identity: ['诗人', '书法家'],
    tags: ['苏黄', '江西诗派', '宋四家'],
    bio: '黄庭坚，字鲁直，号山谷道人，晚号涪翁，洪州分宁人。北宋著名文学家、书法家，为盛极一时的江西诗派开山之祖。与杜甫、陈师道和陈与义素有"一祖三宗"之称。与张耒、晁补之、秦观都游学于苏轼门下，合称为"苏门四学士"。',
  },
  {
    id: 'qin-guan',
    name: '秦观',
    courtesyName: '少游',
    pseudonym: '淮海居士',
    dynasty: '北宋',
    birthYear: 1049,
    deathYear: 1100,
    identity: ['词人', '诗人'],
    tags: ['苏门四学士', '淮海居士', '婉约派'],
    bio: '秦观，字少游，一字太虚，号淮海居士，高邮人。北宋文学家、词人，被尊为婉约派一代词宗。与黄庭坚、晁补之、张耒合称"苏门四学士"。',
  },
  {
    id: 'lu-you',
    name: '陆游',
    courtesyName: '务观',
    pseudonym: '放翁',
    dynasty: '南宋',
    birthYear: 1125,
    deathYear: 1210,
    identity: ['诗人', '词人'],
    tags: ['中兴四大诗人', '放翁', '爱国诗人'],
    bio: '陆游，字务观，号放翁，越州山阴人。南宋文学家、史学家、爱国诗人。其一生笔耕不辍，诗词文具有很高成就。其诗语言平易晓畅、章法整饬谨严，兼具李白的雄奇奔放与杜甫的沉郁悲凉，尤以饱含爱国热情对后世影响深远。',
  },
];

// Relationships for the network graph
export const relationships: Relation[] = [
  // 苏轼的关系
  { source: '苏轼', target: '黄庭坚', type: '师友', description: '苏黄并称，苏轼为师，黄庭坚为苏门四学士之一' },
  { source: '苏轼', target: '秦观', type: '师友', description: '秦观为苏门四学士之一，深受苏轼赏识' },
  { source: '苏轼', target: '王安石', type: '对手', description: '新旧党争中的政敌，但彼此欣赏文学才华' },
  { source: '苏轼', target: '欧阳修', type: '师友', description: '欧阳修为苏轼科举考官，引为知己' },
  { source: '苏轼', target: '辛弃疾', type: '文学', description: '并称苏辛，豪放派词人的代表' },
  { source: '苏轼', target: '李清照', type: '文学', description: '同时代文人，李清照之父与苏轼交好' },

  // 李白的关系
  { source: '李白', target: '杜甫', type: '师友', description: '李杜并称，杜甫对李白推崇备至' },

  // 杜甫的关系
  { source: '杜甫', target: '李白', type: '师友', description: '杜甫视李白为挚友，多次写诗怀念' },

  // 欧阳修的关系
  { source: '欧阳修', target: '王安石', type: '师友', description: '欧阳修赏识王安石才华，曾举荐之' },
  { source: '欧阳修', target: '苏轼', type: '师友', description: '科举师生，欧阳修称"老夫当避路，放他出一头地"' },

  // 黄庭坚的关系
  { source: '黄庭坚', target: '秦观', type: '师友', description: '同为苏门四学士，交谊甚厚' },

  // 辛弃疾的关系
  { source: '辛弃疾', target: '陆游', type: '师友', description: '同为南宋爱国诗人，惺惺相惜' },

  // 李清照的关系
  { source: '李清照', target: '辛弃疾', type: '文学', description: '并称济南二安，一婉约一豪放' },
];

// 苏轼的时间线事件
export const suShiTimeline: TimelineEvent[] = [
  { year: 1037, age: 0, title: '出生于眉州', description: '苏轼出生于四川眉山，父苏洵、弟苏辙', location: '眉州', type: '生活' },
  { year: 1056, age: 19, title: '随父进京赶考', description: '与弟苏辙随父苏洵赴京参加科举考试', location: '汴京', type: '仕途' },
  { year: 1057, age: 20, title: '进士及第', description: '欧阳修主持考试，苏轼名列第二，名震京师', location: '汴京', type: '仕途' },
  { year: 1061, age: 24, title: '制科入等', description: '参加制科考试，入第三等（宋代最高等）', location: '汴京', type: '仕途' },
  { year: 1065, age: 28, title: '妻子王弗去世', description: '爱妻王弗病逝，后作《江城子》悼念', location: '汴京', type: '生活' },
  { year: 1069, age: 32, title: '王安石变法开始', description: '苏轼反对新法，上书论政', location: '汴京', type: '政治' },
  { year: 1071, age: 34, title: '出为杭州通判', description: '因反对新法，被外放为杭州通判', location: '杭州', type: '仕途' },
  { year: 1074, age: 37, title: '移知密州', description: '调任密州知州，作《江城子·密州出猎》', location: '密州', type: '仕途' },
  { year: 1076, age: 39, title: '中秋怀弟', description: '中秋夜作《水调歌头·明月几时有》', location: '密州', type: '文学' },
  { year: 1079, age: 42, title: '乌台诗案', description: '因诗获罪，入狱百余日，险些丧命', location: '汴京', type: '政治' },
  { year: 1080, age: 43, title: '贬谪黄州', description: '被贬为黄州团练副使，自号"东坡居士"', location: '黄州', type: '仕途' },
  { year: 1082, age: 45, title: '赤壁怀古', description: '游赤壁，作《念奴娇·赤壁怀古》《前赤壁赋》', location: '黄州', type: '文学' },
  { year: 1086, age: 49, title: '还朝任翰林学士', description: '旧党执政，苏轼被召回京', location: '汴京', type: '仕途' },
  { year: 1089, age: 52, title: '出知杭州', description: '任杭州知州，疏浚西湖，修苏堤', location: '杭州', type: '仕途' },
  { year: 1094, age: 57, title: '再贬惠州', description: '新党再起，苏轼被贬至广东惠州', location: '惠州', type: '仕途' },
  { year: 1097, age: 60, title: '远谪儋州', description: '被贬至海南儋州，为最远之贬谪', location: '儋州', type: '仕途' },
  { year: 1100, age: 63, title: '遇赦北归', description: '宋徽宗即位，大赦天下，苏轼遇赦', location: '儋州', type: '仕途' },
  { year: 1101, age: 64, title: '病逝于常州', description: '北归途中病逝于常州，追谥"文忠"', location: '常州', type: '生活' },
];

// 各人物生平时间轴数据
export const figureTimelines: Record<string, TimelineEvent[]> = {
  '苏轼': suShiTimeline,
  '李白': [
    { year: 701, age: 0, title: '出生于碎叶城', description: '李白出生于安西都护府碎叶城（今吉尔吉斯斯坦），五岁随父迁居四川', location: '碎叶城', type: '生活' },
    { year: 725, age: 24, title: '出蜀远游', description: '仗剑去国，辞亲远游，沿长江东下，开始漫游生涯', location: '江陵', type: '游历' },
    { year: 730, age: 29, title: '寓居安陆', description: '与故相许圉师孙女结婚，寓居安陆十年', location: '安陆', type: '生活' },
    { year: 742, age: 41, title: '供奉翰林', description: '唐玄宗召入长安，供奉翰林，名动京师', location: '长安', type: '仕途' },
    { year: 744, age: 43, title: '赐金放还', description: '因权贵谗毁，被玄宗"赐金放还"，离开长安', location: '长安', type: '政治' },
    { year: 744, age: 43, title: '遇杜甫于洛阳', description: '与杜甫、高适同游梁宋，结为挚友', location: '洛阳', type: '文学' },
    { year: 755, age: 54, title: '安史之乱爆发', description: '安史之乱爆发，李白避乱庐山', location: '庐山', type: '政治' },
    { year: 756, age: 55, title: '入永王幕府', description: '入永王李璘幕府，后永王兵败，李白受牵连下狱', location: '浔阳', type: '政治' },
    { year: 757, age: 56, title: '流放夜郎', description: '被判流放夜郎（今贵州），途中遇赦', location: '夜郎', type: '仕途' },
    { year: 759, age: 58, title: '遇赦东归', description: '白帝城遇赦，作《早发白帝城》', location: '白帝城', type: '文学' },
    { year: 762, age: 61, title: '病逝于当涂', description: '投奔族叔李阳冰，病逝于当涂，葬于青山', location: '当涂', type: '生活' },
  ],
  '杜甫': [
    { year: 712, age: 0, title: '出生于巩县', description: '杜甫出生于河南巩县，出身京兆杜氏', location: '巩县', type: '生活' },
    { year: 735, age: 23, title: '应试落第', description: '赴长安参加进士考试，未中', location: '长安', type: '仕途' },
    { year: 744, age: 32, title: '遇李白于洛阳', description: '与李白同游梁宋，结为挚友', location: '洛阳', type: '文学' },
    { year: 755, age: 43, title: '安史之乱爆发', description: '安史之乱爆发，杜甫将家小安置鄜州，只身投奔灵武', location: '长安', type: '政治' },
    { year: 757, age: 45, title: '授左拾遗', description: '冒死进言为房琯求情，被肃宗疏远', location: '凤翔', type: '仕途' },
    { year: 759, age: 47, title: '弃官入川', description: '弃官携家入川，筑草堂于成都浣花溪', location: '成都', type: '生活' },
    { year: 761, age: 49, title: '建成都草堂', description: '在成都浣花溪畔建草堂，写《茅屋为秋风所破歌》', location: '成都', type: '文学' },
    { year: 764, age: 52, title: '入严武幕府', description: '严武荐为检校工部员外郎，故称"杜工部"', location: '成都', type: '仕途' },
    { year: 765, age: 53, title: '离蜀东下', description: '严武去世，杜甫离蜀，沿江东下', location: '夔州', type: '游历' },
    { year: 767, age: 55, title: '寓居夔州', description: '寓居夔州近两年，创作大量名篇，作《登高》', location: '夔州', type: '文学' },
    { year: 770, age: 58, title: '病逝于湘江舟中', description: '病逝于湘江舟中，后归葬偃师', location: '湘江', type: '生活' },
  ],
  '辛弃疾': [
    { year: 1140, age: 0, title: '出生于济南', description: '辛弃疾出生于山东济南历城，时为金国占领区', location: '济南', type: '生活' },
    { year: 1161, age: 21, title: '起义抗金', description: '金主完颜亮南侵，辛弃疾聚众两千人起义抗金', location: '济南', type: '政治' },
    { year: 1162, age: 22, title: '南归宋朝', description: '率部南归南宋，擒叛将张安国，名震朝野', location: '建康', type: '仕途' },
    { year: 1170, age: 30, title: '上《美芹十论》', description: '上书《美芹十论》，陈述抗金方略，未获采纳', location: '临安', type: '政治' },
    { year: 1172, age: 32, title: '知滁州', description: '任滁州知州，政绩卓著', location: '滁州', type: '仕途' },
    { year: 1181, age: 41, title: '落职闲居', description: '被弹劾落职，闲居上饶带湖十年', location: '上饶', type: '仕途' },
    { year: 1188, age: 48, title: '与陈亮鹅湖之会', description: '与陈亮在鹅湖畅谈国事，共抒恢复之志', location: '鹅湖', type: '文学' },
    { year: 1192, age: 52, title: '任福建提点刑狱', description: '复出任职，后又被弹劾罢官', location: '福州', type: '仕途' },
    { year: 1203, age: 63, title: '起任浙东安抚使', description: '韩侂胄北伐起用辛弃疾，任浙东安抚使', location: '绍兴', type: '仕途' },
    { year: 1205, age: 65, title: '罢官归隐', description: '再度被罢官，归隐铅山瓢泉', location: '铅山', type: '仕途' },
    { year: 1207, age: 67, title: '病逝于铅山', description: '临终大呼"杀贼！杀贼！"含恨而终', location: '铅山', type: '生活' },
  ],
  '李清照': [
    { year: 1084, age: 0, title: '出生于济南', description: '李清照出生于济南章丘，父李格非为著名学者', location: '济南', type: '生活' },
    { year: 1101, age: 17, title: '嫁赵明诚', description: '与太学生赵明诚结婚，夫妻志同道合', location: '汴京', type: '生活' },
    { year: 1107, age: 23, title: '屏居青州', description: '因党争之祸，夫妻回青州闲居十年', location: '青州', type: '仕途' },
    { year: 1127, age: 43, title: '靖康之变', description: '金兵入侵，北宋灭亡，开始南渡流亡', location: '青州', type: '政治' },
    { year: 1129, age: 45, title: '赵明诚病逝', description: '丈夫赵明诚病逝于建康，李清照孤身流亡', location: '建康', type: '生活' },
    { year: 1130, age: 46, title: '追随朝廷南逃', description: '追随南宋朝廷经越州、明州至温州', location: '温州', type: '游历' },
    { year: 1132, age: 48, title: '定居杭州', description: '定居临安（杭州），晚年生活凄凉', location: '杭州', type: '生活' },
    { year: 1134, age: 50, title: '完成《金石录后序》', description: '为赵明诚遗作《金石录》作后序，追忆生平', location: '杭州', type: '文学' },
    { year: 1155, age: 71, title: '卒于杭州', description: '约于此年病逝于杭州，具体年份有争议', location: '杭州', type: '生活' },
  ],
  '王安石': [
    { year: 1021, age: 0, title: '出生于临川', description: '王安石出生于江西临川，出身官宦世家', location: '临川', type: '生活' },
    { year: 1042, age: 21, title: '进士及第', description: '中进士第四名，开始仕途生涯', location: '汴京', type: '仕途' },
    { year: 1047, age: 26, title: '任鄞县知县', description: '任浙江鄞县知县，兴修水利，政绩卓著', location: '鄞县', type: '仕途' },
    { year: 1058, age: 37, title: '上《言事书》', description: '向仁宗上《言事书》，提出变法主张', location: '汴京', type: '政治' },
    { year: 1069, age: 48, title: '拜参知政事', description: '宋神宗任命其为参知政事，推行新法', location: '汴京', type: '仕途' },
    { year: 1070, age: 49, title: '推行青苗法', description: '推行青苗法、免役法、方田均税法等新法', location: '汴京', type: '政治' },
    { year: 1074, age: 53, title: '首次罢相', description: '因阻力太大，首次辞相，出知江宁府', location: '江宁', type: '仕途' },
    { year: 1075, age: 54, title: '复相', description: '再度拜相，但新法推行困难', location: '汴京', type: '仕途' },
    { year: 1076, age: 55, title: '二次罢相', description: '再次辞相，退居江宁钟山', location: '江宁', type: '仕途' },
    { year: 1085, age: 64, title: '神宗驾崩', description: '宋神宗驾崩，新法陆续被废', location: '江宁', type: '政治' },
    { year: 1086, age: 65, title: '病逝于江宁', description: '病逝于江宁，追赠太傅，谥号"文"', location: '江宁', type: '生活' },
  ],
  '白居易': [
    { year: 772, age: 0, title: '出生于新郑', description: '白居易出生于河南新郑，祖籍山西太原', location: '新郑', type: '生活' },
    { year: 800, age: 28, title: '进士及第', description: '考中进士，开始仕途', location: '长安', type: '仕途' },
    { year: 807, age: 35, title: '任盩厔尉', description: '任盩厔县尉，作《长恨歌》', location: '盩厔', type: '文学' },
    { year: 815, age: 43, title: '贬江州司马', description: '因越职言事被贬为江州司马，作《琵琶行》', location: '江州', type: '仕途' },
    { year: 818, age: 46, title: '任忠州刺史', description: '转任忠州刺史', location: '忠州', type: '仕途' },
    { year: 822, age: 50, title: '任杭州刺史', description: '出任杭州刺史，疏浚六井，修白堤', location: '杭州', type: '仕途' },
    { year: 825, age: 53, title: '任苏州刺史', description: '转任苏州刺史', location: '苏州', type: '仕途' },
    { year: 827, age: 55, title: '回长安任秘书监', description: '回京任职，后官至刑部尚书', location: '长安', type: '仕途' },
    { year: 833, age: 61, title: '退居洛阳', description: '以太子宾客分司东都，定居洛阳', location: '洛阳', type: '生活' },
    { year: 846, age: 74, title: '病逝于洛阳', description: '病逝于洛阳，葬于龙门香山', location: '洛阳', type: '生活' },
  ],
  '欧阳修': [
    { year: 1007, age: 0, title: '出生于绵州', description: '欧阳修出生于四川绵州（今绵阳），四岁丧父', location: '绵州', type: '生活' },
    { year: 1030, age: 23, title: '进士及第', description: '考中进士，开始仕途', location: '汴京', type: '仕途' },
    { year: 1036, age: 29, title: '贬夷陵令', description: '因替范仲淹辩护，被贬为夷陵县令', location: '夷陵', type: '仕途' },
    { year: 1043, age: 36, title: '参与庆历新政', description: '支持范仲淹推行庆历新政，上《朋党论》', location: '汴京', type: '政治' },
    { year: 1045, age: 38, title: '贬滁州', description: '新政失败，被贬为滁州知州，作《醉翁亭记》', location: '滁州', type: '文学' },
    { year: 1054, age: 47, title: '还朝任翰林学士', description: '还朝任翰林学士，修《新唐书》', location: '汴京', type: '仕途' },
    { year: 1057, age: 50, title: '知贡举', description: '主持科举，录取苏轼、苏辙、曾巩等', location: '汴京', type: '文学' },
    { year: 1060, age: 53, title: '修成《新唐书》', description: '与宋祁合修《新唐书》完成', location: '汴京', type: '文学' },
    { year: 1067, age: 60, title: '出知亳州', description: '因濮议之争，出知亳州', location: '亳州', type: '仕途' },
    { year: 1070, age: 63, title: '退居颍州', description: '致仕归隐颍州', location: '颍州', type: '生活' },
    { year: 1072, age: 65, title: '病逝于颍州', description: '病逝，追赠太师，谥号"文忠"', location: '颍州', type: '生活' },
  ],
  '陆游': [
    { year: 1125, age: 0, title: '出生于越州', description: '陆游出生于越州山阴（今绍兴），生于靖康之变前夕', location: '山阴', type: '生活' },
    { year: 1153, age: 28, title: '应试被黜', description: '锁厅考试第一，但因秦桧之孙排挤，殿试被黜', location: '临安', type: '仕途' },
    { year: 1158, age: 33, title: '初入仕途', description: '秦桧死后，方得出任福州宁德县主簿', location: '宁德', type: '仕途' },
    { year: 1163, age: 38, title: '支持北伐', description: '上书支持张浚北伐，北伐失败后被贬', location: '临安', type: '政治' },
    { year: 1170, age: 45, title: '入蜀从军', description: '入四川宣抚使王炎幕府，从军南郑', location: '南郑', type: '仕途' },
    { year: 1172, age: 47, title: '蜀中九年', description: '在蜀中任职九年，自号"放翁"', location: '成都', type: '生活' },
    { year: 1178, age: 53, title: '东归出蜀', description: '奉诏东归，历任福建、江南西路常平茶盐公事', location: '建安', type: '仕途' },
    { year: 1186, age: 61, title: '闲居山阴', description: '被弹劾罢官，闲居山阴，作《书愤》', location: '山阴', type: '文学' },
    { year: 1199, age: 74, title: '作《钗头凤》', description: '重游沈园，怀念前妻唐婉', location: '山阴', type: '文学' },
    { year: 1210, age: 85, title: '病逝于山阴', description: '临终作《示儿》："王师北定中原日，家祭无忘告乃翁"', location: '山阴', type: '生活' },
  ],
  '陶渊明': [
    { year: 365, age: 0, title: '出生于浔阳', description: '陶渊明出生于浔阳柴桑（今江西九江），曾祖为东晋名将陶侃', location: '柴桑', type: '生活' },
    { year: 393, age: 28, title: '初仕江州祭酒', description: '任江州祭酒，因不堪吏职之苦，不久辞归', location: '江州', type: '仕途' },
    { year: 400, age: 35, title: '入桓玄幕府', description: '入桓玄幕府，后因母丧辞归', location: '江陵', type: '仕途' },
    { year: 404, age: 39, title: '任镇军参军', description: '入刘裕幕府任镇军参军', location: '京口', type: '仕途' },
    { year: 405, age: 40, title: '任彭泽县令', description: '任彭泽县令，仅八十余日便辞官', location: '彭泽', type: '仕途' },
    { year: 405, age: 40, title: '辞官归隐', description: '"不为五斗米折腰"，辞官归隐，作《归去来兮辞》', location: '柴桑', type: '生活' },
    { year: 408, age: 43, title: '旧居遭火灾', description: '旧居遭火灾，迁居南村', location: '柴桑', type: '生活' },
    { year: 417, age: 52, title: '作《桃花源记》', description: '创作《桃花源记》，描绘理想社会', location: '柴桑', type: '文学' },
    { year: 420, age: 55, title: '刘裕代晋', description: '刘裕篡晋建宋，陶渊明不愿仕宋，改名"潜"', location: '柴桑', type: '政治' },
    { year: 427, age: 62, title: '病逝于柴桑', description: '病逝于柴桑，友人私谥"靖节先生"', location: '柴桑', type: '生活' },
  ],
  '李商隐': [
    { year: 813, age: 0, title: '出生于怀州', description: '李商隐出生于怀州河内（今河南沁阳）', location: '河内', type: '生活' },
    { year: 829, age: 16, title: '受知令狐楚', description: '被天平军节度使令狐楚赏识，学习骈文', location: '郓州', type: '仕途' },
    { year: 837, age: 24, title: '进士及第', description: '在令狐楚之子令狐绹帮助下中进士', location: '长安', type: '仕途' },
    { year: 838, age: 25, title: '入王茂元幕府', description: '入泾原节度使王茂元幕府，娶其女为妻', location: '泾原', type: '生活' },
    { year: 839, age: 26, title: '陷入牛李党争', description: '因娶王茂元之女，被视为李德裕党，遭令狐绹等牛党排斥', location: '长安', type: '政治' },
    { year: 842, age: 29, title: '母丧守制', description: '母亲去世，回乡守制三年', location: '怀州', type: '生活' },
    { year: 845, age: 32, title: '再入仕途', description: '守制期满，重回长安，但仕途坎坷', location: '长安', type: '仕途' },
    { year: 851, age: 38, title: '随柳仲郢入蜀', description: '随柳仲郢赴东川，任节度书记', location: '梓州', type: '仕途' },
    { year: 855, age: 42, title: '返回长安', description: '随柳仲郢回长安，任盐铁推官', location: '长安', type: '仕途' },
    { year: 858, age: 45, title: '病逝于郑州', description: '病逝于郑州，一生困于党争，才华未展', location: '郑州', type: '生活' },
  ],
};

// 各人物诗词数据
export const figurePoems: Record<string, Poem[]> = {
  '苏轼': [
    {
      title: '水调歌头·明月几时有',
      content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。\n\n转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
      year: 1076,
      location: '密州',
      background: '丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。',
      tags: ['中秋', '怀人', '豪放'],
    },
    {
      title: '念奴娇·赤壁怀古',
      content: '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。\n\n遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间，樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。',
      year: 1082,
      location: '黄州',
      background: '苏轼谪居黄州，游赤壁矶，怀古伤今而作。',
      tags: ['怀古', '豪放', '赤壁'],
    },
    {
      title: '江城子·乙卯正月二十日夜记梦',
      content: '十年生死两茫茫，不思量，自难忘。千里孤坟，无处话凄凉。纵使相逢应不识，尘满面，鬓如霜。\n\n夜来幽梦忽还乡，小轩窗，正梳妆。相顾无言，惟有泪千行。料得年年肠断处，明月夜，短松冈。',
      year: 1075,
      location: '密州',
      background: '苏轼悼念亡妻王弗之作，此时王弗已去世十年。',
      tags: ['悼亡', '婉约', '深情'],
    },
    {
      title: '江城子·密州出猎',
      content: '老夫聊发少年狂，左牵黄，右擎苍，锦帽貂裘，千骑卷平冈。为报倾城随太守，亲射虎，看孙郎。\n\n酒酣胸胆尚开张，鬓微霜，又何妨！持节云中，何日遣冯唐？会挽雕弓如满月，西北望，射天狼。',
      year: 1074,
      location: '密州',
      background: '密州出猎时作，抒发报国壮志。',
      tags: ['豪放', '壮志', '出猎'],
    },
    {
      title: '定风波·莫听穿林打叶声',
      content: '莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。\n\n料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。',
      year: 1082,
      location: '黄州',
      background: '三月七日，沙湖道中遇雨，雨具先去，同行皆狼狈，余独不觉。已而遂晴，故作此词。',
      tags: ['旷达', '哲理', '黄州'],
    },
    {
      title: '前赤壁赋',
      content: '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。白露横江，水光接天。纵一苇之所如，凌万顷之茫然。浩浩乎如冯虚御风，而不知其所止；飘飘乎如遗世独立，羽化而登仙。',
      year: 1082,
      location: '黄州',
      background: '谪居黄州期间，与客泛舟赤壁之下而作。',
      tags: ['赋', '哲理', '赤壁'],
    },
  ],
  '李白': [
    {
      title: '将进酒',
      content: '君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。\n\n烹羊宰牛且为乐，会须一饮三百杯。岑夫子，丹丘生，将进酒，杯莫停。与君歌一曲，请君为我倾耳听。钟鼓馔玉不足贵，但愿长醉不复醒。古来圣贤皆寂寞，惟有饮者留其名。',
      year: 752,
      location: '嵩山',
      background: '与友人岑勋、元丹丘在嵩山饮酒时作，抒发怀才不遇之感。',
      tags: ['饮酒', '豪放', '怀才'],
    },
    {
      title: '静夜思',
      content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
      year: 726,
      location: '扬州',
      background: '客居扬州旅舍，秋夜月色如霜，思乡而作。',
      tags: ['思乡', '月亮', '五言绝句'],
    },
    {
      title: '蜀道难',
      content: '噫吁嚱，危乎高哉！蜀道之难，难于上青天！蚕丛及鱼凫，开国何茫然！尔来四万八千岁，不与秦塞通人烟。西当太白有鸟道，可以横绝峨眉巅。地崩山摧壮士死，然后天梯石栈相钩连。',
      year: 730,
      location: '长安',
      background: '初入长安，送友人入蜀时作，极言蜀道之险。',
      tags: ['送别', '山水', '乐府'],
    },
    {
      title: '望庐山瀑布',
      content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
      year: 756,
      location: '庐山',
      background: '游庐山时作，以夸张手法描绘瀑布之壮观。',
      tags: ['山水', '瀑布', '七言绝句'],
    },
    {
      title: '早发白帝城',
      content: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。',
      year: 759,
      location: '白帝城',
      background: '安史之乱后获赦，从白帝城东归江陵时作，喜悦之情溢于言表。',
      tags: ['归途', '喜悦', '七言绝句'],
    },
    {
      title: '月下独酌',
      content: '花间一壶酒，独酌无相亲。举杯邀明月，对影成三人。月既不解饮，影徒随我身。暂伴月将影，行乐须及春。我歌月徘徊，我舞影零乱。醒时同交欢，醉后各分散。永结无情游，相期邈云汉。',
      year: 744,
      location: '长安',
      background: '供奉翰林期间，月下独酌有感而作。',
      tags: ['独酌', '月亮', '五言古诗'],
    },
  ],
  '杜甫': [
    {
      title: '春望',
      content: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。',
      year: 757,
      location: '长安',
      background: '安史之乱中，杜甫陷于长安，目睹国破家亡而作。',
      tags: ['忧国', '战乱', '五言律诗'],
    },
    {
      title: '登高',
      content: '风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽长江滚滚来。万里悲秋常作客，百年多病独登台。艰难苦恨繁霜鬓，潦倒新停浊酒杯。',
      year: 767,
      location: '夔州',
      background: '秋日登高，感伤身世飘零、老病孤愁而作。',
      tags: ['悲秋', '登高', '七言律诗'],
    },
    {
      title: '茅屋为秋风所破歌',
      content: '八月秋高风怒号，卷我屋上三重茅。茅飞渡江洒江郊，高者挂罥长林梢，下者飘转沉塘坳。南村群童欺我老无力，忍能对面为盗贼。公然抱茅入竹去，唇焦口燥呼不得，归来倚杖自叹息。\n\n安得广厦千万间，大庇天下寒士俱欢颜！风雨不动安如山。呜呼！何时眼前突兀见此屋，吾庐独破受冻死亦足！',
      year: 761,
      location: '成都',
      background: '居成都草堂，秋风破屋，感而作此，忧天下寒士。',
      tags: ['忧民', '草堂', '乐府'],
    },
    {
      title: '望岳',
      content: '岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。荡胸生曾云，决眦入归鸟。会当凌绝顶，一览众山小。',
      year: 736,
      location: '兖州',
      background: '青年时期漫游齐鲁，望泰山而作，胸怀壮志。',
      tags: ['咏山', '壮志', '五言古诗'],
    },
    {
      title: '蜀相',
      content: '丞相祠堂何处寻？锦官城外柏森森。映阶碧草自春色，隔叶黄鹂空好音。三顾频烦天下计，两朝开济老臣心。出师未捷身先死，长使英雄泪满襟。',
      year: 760,
      location: '成都',
      background: '初至成都，访武侯祠，缅怀诸葛亮而作。',
      tags: ['咏史', '怀古', '七言律诗'],
    },
    {
      title: '江南逢李龟年',
      content: '岐王宅里寻常见，崔九堂前几度闻。正是江南好风景，落花时节又逢君。',
      year: 770,
      location: '长沙',
      background: '流落江南，偶遇故人李龟年，感伤盛世不再。',
      tags: ['重逢', '感伤', '七言绝句'],
    },
  ],
  '辛弃疾': [
    {
      title: '破阵子·为陈同甫赋壮词以寄之',
      content: '醉里挑灯看剑，梦回吹角连营。八百里分麾下炙，五十弦翻塞外声，沙场秋点兵。\n\n马作的卢飞快，弓如霹雳弦惊。了却君王天下事，赢得生前身后名。可怜白发生！',
      year: 1188,
      location: '鹅湖',
      background: '与陈亮鹅湖相会，共商恢复大计，壮志难酬而作。',
      tags: ['壮志', '军旅', '豪放'],
    },
    {
      title: '青玉案·元夕',
      content: '东风夜放花千树，更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。\n\n蛾儿雪柳黄金缕，笑语盈盈暗香去。众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。',
      year: 1174,
      location: '临安',
      background: '元夕之夜，于临安城中作，以美人暗喻高洁志向。',
      tags: ['元夕', '寓志', '婉约'],
    },
    {
      title: '永遇乐·京口北固亭怀古',
      content: '千古江山，英雄无觅孙仲谋处。舞榭歌台，风流总被雨打风吹去。斜阳草树，寻常巷陌，人道寄奴曾住。想当年，金戈铁马，气吞万里如虎。\n\n元嘉草草，封狼居胥，赢得仓皇北顾。四十三年，望中犹记，烽火扬州路。可堪回首，佛狸祠下，一片神鸦社鼓。凭谁问：廉颇老矣，尚能饭否？',
      year: 1205,
      location: '京口',
      background: '任镇江知府，登北固亭，怀古伤今，忧心北伐。',
      tags: ['怀古', '忧国', '豪放'],
    },
    {
      title: '西江月·夜行黄沙道中',
      content: '明月别枝惊鹊，清风半夜鸣蝉。稻花香里说丰年，听取蛙声一片。\n\n七八个星天外，两三点雨山前。旧时茅店社林边，路转溪桥忽见。',
      year: 1181,
      location: '上饶',
      background: '闲居上饶带湖期间，夜行黄沙道中所见。',
      tags: ['田园', '夜景', '闲居'],
    },
    {
      title: '丑奴儿·书博山道中壁',
      content: '少年不识愁滋味，爱上层楼。爱上层楼，为赋新词强说愁。\n\n而今识尽愁滋味，欲说还休。欲说还休，却道天凉好个秋。',
      year: 1181,
      location: '博山',
      background: '闲居期间，道中题壁，抒壮志难酬之愁。',
      tags: ['愁绪', '闲居', '哲理'],
    },
    {
      title: '水龙吟·登建康赏心亭',
      content: '楚天千里清秋，水随天去秋无际。遥岑远目，献愁供恨，玉簪螺髻。落日楼头，断鸿声里，江南游子。把吴钩看了，栏杆拍遍，无人会，登临意。\n\n休说鲈鱼堪脍，尽西风、季鹰归未？求田问舍，怕应羞见，刘郎才气。可惜流年，忧愁风雨，树犹如此！倩何人唤取，红巾翠袖，揾英雄泪？',
      year: 1174,
      location: '建康',
      background: '南归后任建康通判，登赏心亭，感慨壮志未酬。',
      tags: ['登临', '壮志', '豪放'],
    },
  ],
  '李清照': [
    {
      title: '如梦令·昨夜雨疏风骤',
      content: '昨夜雨疏风骤，浓睡不消残酒。试问卷帘人，却道海棠依旧。知否，知否？应是绿肥红瘦。',
      year: 1100,
      location: '汴京',
      background: '少女时期所作，以对话形式写惜春之情。',
      tags: ['惜春', '对话', '婉约'],
    },
    {
      title: '声声慢·寻寻觅觅',
      content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。\n\n满地黄花堆积，憔悴损，如今有谁堪摘？守着窗儿，独自怎生得黑！梧桐更兼细雨，到黄昏、点点滴滴。这次第，怎一个愁字了得！',
      year: 1129,
      location: '杭州',
      background: '南渡后丈夫赵明诚病逝，孤苦无依中所作。',
      tags: ['悲愁', '寡居', '婉约'],
    },
    {
      title: '一剪梅·红藕香残玉簟秋',
      content: '红藕香残玉簟秋。轻解罗裳，独上兰舟。云中谁寄锦书来？雁字回时，月满西楼。\n\n花自飘零水自流。一种相思，两处闲愁。此情无计可消除，才下眉头，却上心头。',
      year: 1103,
      location: '青州',
      background: '与赵明诚新婚别后，思念丈夫而作。',
      tags: ['相思', '离别', '婉约'],
    },
    {
      title: '夏日绝句',
      content: '生当作人杰，死亦为鬼雄。至今思项羽，不肯过江东。',
      year: 1127,
      location: '乌江',
      background: '靖康之变后，南渡途经乌江，有感于项羽壮烈而作。',
      tags: ['咏史', '壮烈', '五言绝句'],
    },
    {
      title: '醉花阴·薄雾浓云愁永昼',
      content: '薄雾浓云愁永昼，瑞脑销金兽。佳节又重阳，玉枕纱厨，半夜凉初透。\n\n东篱把酒黄昏后，有暗香盈袖。莫道不销魂，帘卷西风，人比黄花瘦。',
      year: 1103,
      location: '汴京',
      background: '重阳佳节，思念远方丈夫赵明诚而作。',
      tags: ['重阳', '相思', '婉约'],
    },
    {
      title: '武陵春·风住尘香花已尽',
      content: '风住尘香花已尽，日晚倦梳头。物是人非事事休，欲语泪先流。\n\n闻说双溪春尚好，也拟泛轻舟。只恐双溪舴艋舟，载不动许多愁。',
      year: 1134,
      location: '金华',
      background: '避难金华时作，国破家亡之痛溢于言表。',
      tags: ['愁绪', '亡国之痛', '婉约'],
    },
  ],
  '王安石': [
    {
      title: '泊船瓜洲',
      content: '京口瓜洲一水间，钟山只隔数重山。春风又绿江南岸，明月何时照我还？',
      year: 1070,
      location: '瓜洲',
      background: '再次拜相赴京途中，泊船瓜洲，思念江宁家中而作。',
      tags: ['思乡', '写景', '七言绝句'],
    },
    {
      title: '登飞来峰',
      content: '飞来山上千寻塔，闻说鸡鸣见日升。不畏浮云遮望眼，自缘身在最高层。',
      year: 1050,
      location: '越州',
      background: '任鄞县知县期满，登飞来峰，抒发改革志向。',
      tags: ['咏志', '登高', '七言绝句'],
    },
    {
      title: '元日',
      content: '爆竹声中一岁除，春风送暖入屠苏。千门万户曈曈日，总把新桃换旧符。',
      year: 1068,
      location: '汴京',
      background: '变法推行之际，以新年万象更新喻改革之意。',
      tags: ['新年', '变法', '七言绝句'],
    },
    {
      title: '梅花',
      content: '墙角数枝梅，凌寒独自开。遥知不是雪，为有暗香来。',
      year: 1076,
      location: '江宁',
      background: '罢相后退居江宁，以梅花自喻孤高品格。',
      tags: ['咏物', '梅花', '五言绝句'],
    },
    {
      title: '明妃曲',
      content: '明妃初出汉宫时，泪湿春风鬓脚垂。低回顾影无颜色，尚得君王不自持。归来却怪丹青手，入眼平生未曾有。意态由来画不成，当时枉杀毛延寿。',
      year: 1059,
      location: '汴京',
      background: '咏王昭君之事，翻新立论，为毛延寿翻案。',
      tags: ['咏史', '昭君', '古体诗'],
    },
    {
      title: '书湖阴先生壁',
      content: '茅檐长扫净无苔，花木成畦手自栽。一水护田将绿绕，两山排闼送青来。',
      year: 1076,
      location: '江宁',
      background: '退居江宁，访邻居湖阴先生杨德逢，题壁而作。',
      tags: ['田园', '题壁', '七言绝句'],
    },
  ],
  '白居易': [
    {
      title: '琵琶行',
      content: '浔阳江头夜送客，枫叶荻花秋瑟瑟。主人下马客在船，举酒欲饮无管弦。醉不成欢惨将别，别时茫茫江浸月。\n\n忽闻水上琵琶声，主人忘归客不发。寻声暗问弹者谁，琵琶声停欲语迟。移船相近邀相见，添酒回灯重开宴。千呼万唤始出来，犹抱琵琶半遮面。',
      year: 816,
      location: '江州',
      background: '被贬江州司马，送客浔阳江头，闻琵琶声有感而作。',
      tags: ['贬谪', '音乐', '长诗'],
    },
    {
      title: '长恨歌',
      content: '汉皇重色思倾国，御宇多年求不得。杨家有女初长成，养在深闺人未识。天生丽质难自弃，一朝选在君王侧。回眸一笑百媚生，六宫粉黛无颜色。\n\n在天愿作比翼鸟，在地愿为连理枝。天长地久有时尽，此恨绵绵无绝期。',
      year: 806,
      location: '盩厔',
      background: '与友人游仙游寺，谈及唐明皇杨贵妃事，感而作此。',
      tags: ['爱情', '咏史', '长诗'],
    },
    {
      title: '赋得古原草送别',
      content: '离离原上草，一岁一枯荣。野火烧不尽，春风吹又生。远芳侵古道，晴翠接荒城。又送王孙去，萋萋满别情。',
      year: 788,
      location: '长安',
      background: '少年时进京应考之作，以草喻送别之情。',
      tags: ['送别', '咏物', '五言律诗'],
    },
    {
      title: '忆江南',
      content: '江南好，风景旧曾谙。日出江花红胜火，春来江水绿如蓝。能不忆江南？',
      year: 838,
      location: '洛阳',
      background: '晚年居洛阳，回忆杭州、苏州旧游而作。',
      tags: ['忆旧', '江南', '词'],
    },
    {
      title: '卖炭翁',
      content: '卖炭翁，伐薪烧炭南山中。满面尘灰烟火色，两鬓苍苍十指黑。卖炭得钱何所营？身上衣裳口中食。可怜身上衣正单，心忧炭贱愿天寒。',
      year: 809,
      location: '长安',
      background: '新乐府运动代表作，揭露宫市之弊，同情民生疾苦。',
      tags: ['讽喻', '民生', '新乐府'],
    },
    {
      title: '钱塘湖春行',
      content: '孤山寺北贾亭西，水面初平云脚低。几处早莺争暖树，谁家新燕啄春泥。乱花渐欲迷人眼，浅草才能没马蹄。最爱湖东行不足，绿杨阴里白沙堤。',
      year: 822,
      location: '杭州',
      background: '任杭州刺史时，春日游西湖所作。',
      tags: ['西湖', '春景', '七言律诗'],
    },
  ],
  '欧阳修': [
    {
      title: '醉翁亭记',
      content: '环滁皆山也。其西南诸峰，林壑尤美，望之蔚然而深秀者，琅琊也。山行六七里，渐闻水声潺潺，而泻出于两峰之间者，酿泉也。峰回路转，有亭翼然临于泉上者，醉翁亭也。\n\n醉翁之意不在酒，在乎山水之间也。山水之乐，得之心而寓之酒也。',
      year: 1046,
      location: '滁州',
      background: '被贬滁州，与民同乐，作此名篇。',
      tags: ['山水', '贬谪', '散文'],
    },
    {
      title: '生查子·元夕',
      content: '去年元夜时，花市灯如昼。月上柳梢头，人约黄昏后。\n\n今年元夜时，月与灯依旧。不见去年人，泪湿春衫袖。',
      year: 1036,
      location: '洛阳',
      background: '元夕感旧，以今昔对比写物是人非之悲。',
      tags: ['元夕', '感旧', '婉约'],
    },
    {
      title: '蝶恋花·庭院深深深几许',
      content: '庭院深深深几许，杨柳堆烟，帘幕无重数。玉勒雕鞍游冶处，楼高不见章台路。\n\n雨横风狂三月暮，门掩黄昏，无计留春住。泪眼问花花不语，乱红飞过秋千去。',
      year: 1040,
      location: '汴京',
      background: '闺怨词名篇，写深闺女子之愁苦孤独。',
      tags: ['闺怨', '伤春', '婉约'],
    },
    {
      title: '采桑子·群芳过后西湖好',
      content: '群芳过后西湖好，狼籍残红，飞絮濛濛，垂柳阑干尽日风。\n\n笙歌散尽游人去，始觉春空，垂下帘栊，双燕归来细雨中。',
      year: 1071,
      location: '颍州',
      background: '退居颍州后，游西湖所作，淡泊闲适。',
      tags: ['西湖', '闲适', '咏景'],
    },
    {
      title: '秋声赋',
      content: '欧阳子方夜读书，闻有声自西南来者，悚然而听之，曰：异哉！初淅沥以萧飒，忽奔腾而砰湃，如波涛夜惊，风雨骤至。其触于物也，鏦鏦铮铮，金铁皆鸣；又如赴敌之兵，衔枚疾走，不闻号令，但闻人马之行声。',
      year: 1059,
      location: '汴京',
      background: '夜读书闻秋声，感悟人生衰老之悲。',
      tags: ['秋声', '感悟', '赋'],
    },
    {
      title: '戏答元珍',
      content: '春风疑不到天涯，二月山城未见花。残雪压枝犹有橘，冻雷惊笋欲抽芽。夜闻归雁生乡思，病入新年感物华。曾是洛阳花下客，野芳虽晚不须嗟。',
      year: 1037,
      location: '夷陵',
      background: '被贬夷陵令时所作，虽处逆境仍不消沉。',
      tags: ['贬谪', '咏春', '七言律诗'],
    },
  ],
  '陆游': [
    {
      title: '示儿',
      content: '死去元知万事空，但悲不见九州同。王师北定中原日，家祭无忘告乃翁。',
      year: 1210,
      location: '山阴',
      background: '临终遗诗，念念不忘收复中原，至死不渝的爱国之情。',
      tags: ['遗诗', '爱国', '七言绝句'],
    },
    {
      title: '钗头凤·红酥手',
      content: '红酥手，黄縢酒，满城春色宫墙柳。东风恶，欢情薄。一怀愁绪，几年离索。错！错！错！\n\n春如旧，人空瘦，泪痕红浥鲛绡透。桃花落，闲池阁。山盟虽在，锦书难托。莫！莫！莫！',
      year: 1155,
      location: '绍兴',
      background: '与前妻唐婉沈园重逢，题壁而作，痛悔之情。',
      tags: ['爱情', '悔恨', '婉约'],
    },
    {
      title: '十一月四日风雨大作',
      content: '僵卧孤村不自哀，尚思为国戍轮台。夜阑卧听风吹雨，铁马冰河入梦来。',
      year: 1192,
      location: '山阴',
      background: '年迈闲居山阴，风雨之夜梦犹征战。',
      tags: ['爱国', '梦征', '七言绝句'],
    },
    {
      title: '游山西村',
      content: '莫笑农家腊酒浑，丰年留客足鸡豚。山重水复疑无路，柳暗花明又一村。箫鼓追随春社近，衣冠简朴古风存。从今若许闲乘月，拄杖无时夜叩门。',
      year: 1167,
      location: '山阴',
      background: '闲居山阴，游山西村所作，写乡间淳朴风光。',
      tags: ['田园', '哲理', '七言律诗'],
    },
    {
      title: '书愤',
      content: '早岁那知世事艰，中原北望气如山。楼船夜雪瓜洲渡，铁马秋风大散关。塞上长城空自许，镜中衰鬓已先斑。出师一表真名世，千载谁堪伯仲间！',
      year: 1186,
      location: '山阴',
      background: '回顾一生壮志未酬，悲愤而作。',
      tags: ['壮志', '悲愤', '七言律诗'],
    },
    {
      title: '卜算子·咏梅',
      content: '驿外断桥边，寂寞开无主。已是黄昏独自愁，更著风和雨。\n\n无意苦争春，一任群芳妒。零落成泥碾作尘，只有香如故。',
      year: 1180,
      location: '山阴',
      background: '以梅花自喻，虽遭排挤打击仍不改高洁志向。',
      tags: ['咏物', '梅花', '孤高'],
    },
  ],
  '陶渊明': [
    {
      title: '饮酒·其五',
      content: '结庐在人境，而无车马喧。问君何能尔？心远地自偏。采菊东篱下，悠然见南山。山气日夕佳，飞鸟相与还。此中有真意，欲辨已忘言。',
      year: 417,
      location: '柴桑',
      background: '归隐后饮酒自得，此首为组诗中最著名者。',
      tags: ['归隐', '饮酒', '五言古诗'],
    },
    {
      title: '归园田居·其一',
      content: '少无适俗韵，性本爱丘山。误落尘网中，一去三十年。羁鸟恋旧林，池鱼思故渊。开荒南野际，守拙归园田。\n\n方宅十余亩，草屋八九间。榆柳荫后檐，桃李罗堂前。暧暧远人村，依依墟里烟。狗吠深巷中，鸡鸣桑树颠。',
      year: 405,
      location: '柴桑',
      background: '辞彭泽令归隐后所作，表达归隐田园之乐。',
      tags: ['归隐', '田园', '五言古诗'],
    },
    {
      title: '桃花源记',
      content: '晋太元中，武陵人捕鱼为业。缘溪行，忘路之远近。忽逢桃花林，夹岸数百步，中无杂树，芳草鲜美，落英缤纷。渔人甚异之，复前行，欲穷其林。\n\n林尽水源，便得一山，山有小口，仿佛若有光。便舍船，从口入。初极狭，才通人。复行数十步，豁然开朗。',
      year: 421,
      location: '柴桑',
      background: '构想理想社会，寄托对美好生活的向往。',
      tags: ['理想', '寓言', '散文'],
    },
    {
      title: '五柳先生传',
      content: '先生不知何许人也，亦不详其姓字，宅边有五柳树，因以为号焉。闲静少言，不慕荣利。好读书，不求甚解；每有会意，便欣然忘食。性嗜酒，家贫不能常得。',
      year: 400,
      location: '柴桑',
      background: '自况之作，以五柳先生自喻，表达淡泊之志。',
      tags: ['自况', '淡泊', '散文'],
    },
    {
      title: '归去来兮辞',
      content: '归去来兮，田园将芜胡不归！既自以心为形役，奚惆怅而独悲？悟已往之不谏，知来者之可追。实迷途其未远，觉今是而昨非。\n\n舟遥遥以轻飏，风飘飘而吹衣。问征夫以前路，恨晨光之熹微。',
      year: 405,
      location: '柴桑',
      background: '辞彭泽令归隐时所作，写归家之喜悦与田园之乐。',
      tags: ['归隐', '辞赋', '喜悦'],
    },
    {
      title: '读山海经·其一',
      content: '孟夏草木长，绕屋树扶疏。众鸟欣有托，吾亦爱吾庐。既耕亦已种，时还读我书。穷巷隔深辙，颇回故人车。欢言酌春酒，摘我园中蔬。微雨从东来，好风与之俱。',
      year: 408,
      location: '柴桑',
      background: '初夏耕读生活，恬淡自适之趣。',
      tags: ['耕读', '田园', '五言古诗'],
    },
  ],
  '李商隐': [
    {
      title: '无题·相见时难别亦难',
      content: '相见时难别亦难，东风无力百花残。春蚕到死丝方尽，蜡炬成灰泪始干。晓镜但愁云鬓改，夜吟应觉月光寒。蓬山此去无多路，青鸟殷勤为探看。',
      year: 850,
      location: '长安',
      background: '无题诗名篇，以缠绵笔调写刻骨相思。',
      tags: ['相思', '无题', '七言律诗'],
    },
    {
      title: '锦瑟',
      content: '锦瑟无端五十弦，一弦一柱思华年。庄生晓梦迷蝴蝶，望帝春心托杜鹃。沧海月明珠有泪，蓝田日暖玉生烟。此情可待成追忆，只是当时已惘然。',
      year: 858,
      location: '长安',
      background: '晚年回顾一生，以锦瑟起兴，感叹年华之逝与情事之迷。',
      tags: ['追忆', '咏怀', '七言律诗'],
    },
    {
      title: '夜雨寄北',
      content: '君问归期未有期，巴山夜雨涨秋池。何当共剪西窗烛，却话巴山夜雨时。',
      year: 851,
      location: '巴蜀',
      background: '旅居巴蜀，思念北方妻子（一说友人）而作。',
      tags: ['思归', '夜雨', '七言绝句'],
    },
    {
      title: '嫦娥',
      content: '云母屏风烛影深，长河渐落晓星沉。嫦娥应悔偷灵药，碧海青天夜夜心。',
      year: 845,
      location: '长安',
      background: '以嫦娥喻孤寂之人，或寄托自身身世之感。',
      tags: ['咏人', '孤独', '七言绝句'],
    },
    {
      title: '登乐游原',
      content: '向晚意不适，驱车登古原。夕阳无限好，只是近黄昏。',
      year: 846,
      location: '长安',
      background: '傍晚登乐游原，感叹美好之短暂。',
      tags: ['登高', '感叹', '五言绝句'],
    },
    {
      title: '贾生',
      content: '宣室求贤访逐臣，贾生才调更无伦。可怜夜半虚前席，不问苍生问鬼神。',
      year: 848,
      location: '长安',
      background: '咏贾谊事，讽统治者不能真正用贤。',
      tags: ['咏史', '讽喻', '七言绝句'],
    },
  ],
};

// 苏轼的时空轨迹
export const suShiTrajectory: TrajectoryPoint[] = [
  { year: 1037, location: '眉州', lng: 103.85, lat: 30.08, event: '出生于眉州眉山', type: '故里' },
  { year: 1056, location: '汴京', lng: 114.35, lat: 34.80, event: '进京赶考', type: '仕途' },
  { year: 1061, location: '凤翔', lng: 107.40, lat: 34.52, event: '任凤翔府签判', type: '仕途' },
  { year: 1065, location: '汴京', lng: 114.35, lat: 34.80, event: '还朝任职', type: '仕途' },
  { year: 1071, location: '杭州', lng: 120.15, lat: 30.28, event: '任杭州通判', type: '仕途' },
  { year: 1074, location: '密州', lng: 119.41, lat: 35.99, event: '移知密州', type: '仕途' },
  { year: 1077, location: '徐州', lng: 117.18, lat: 34.26, event: '移知徐州', type: '仕途' },
  { year: 1079, location: '湖州', lng: 120.10, lat: 30.88, event: '移知湖州，被捕入京', type: '仕途' },
  { year: 1080, location: '黄州', lng: 114.87, lat: 30.45, event: '贬谪黄州', type: '流放' },
  { year: 1086, location: '汴京', lng: 114.35, lat: 34.80, event: '还朝任翰林学士', type: '仕途' },
  { year: 1089, location: '杭州', lng: 120.15, lat: 30.28, event: '出知杭州，修苏堤', type: '仕途' },
  { year: 1094, location: '惠州', lng: 114.42, lat: 23.11, event: '再贬惠州', type: '流放' },
  { year: 1097, location: '儋州', lng: 109.58, lat: 19.52, event: '远谪儋州', type: '流放' },
  { year: 1100, location: '儋州', lng: 109.58, lat: 19.52, event: '遇赦北归', type: '仕途' },
  { year: 1101, location: '常州', lng: 119.97, lat: 31.77, event: '病逝于常州', type: '生活' },
];

// 全部人物的时空轨迹（简化版，用于地图展示）
export const allTrajectories: Record<string, TrajectoryPoint[]> = {
  '苏轼': suShiTrajectory,
  '李白': [
    { year: 701, location: '碎叶城', lng: 75.99, lat: 42.78, event: '出生于碎叶城', type: '故里' },
    { year: 725, location: '江陵', lng: 112.18, lat: 30.35, event: '出蜀远游', type: '游历' },
    { year: 730, location: '安陆', lng: 113.69, lat: 31.26, event: '寓居安陆', type: '生活' },
    { year: 742, location: '长安', lng: 108.94, lat: 34.26, event: '供奉翰林', type: '仕途' },
    { year: 744, location: '洛阳', lng: 112.45, lat: 34.62, event: '遇杜甫于洛阳', type: '游历' },
    { year: 755, location: '庐山', lng: 115.99, lat: 29.56, event: '隐居庐山', type: '游历' },
    { year: 757, location: '夜郎', lng: 107.30, lat: 28.22, event: '流放夜郎途中', type: '流放' },
    { year: 759, location: '白帝城', lng: 109.54, lat: 31.04, event: '遇赦东归', type: '仕途' },
    { year: 762, location: '当涂', lng: 118.50, lat: 31.57, event: '病逝于当涂', type: '生活' },
  ],
  '杜甫': [
    { year: 712, location: '巩县', lng: 112.97, lat: 34.78, event: '出生于巩县', type: '故里' },
    { year: 735, location: '长安', lng: 108.94, lat: 34.26, event: '应试落第', type: '仕途' },
    { year: 744, location: '洛阳', lng: 112.45, lat: 34.62, event: '遇李白于洛阳', type: '游历' },
    { year: 755, location: '长安', lng: 108.94, lat: 34.26, event: '安史之乱被困长安', type: '流放' },
    { year: 757, location: '凤翔', lng: 107.40, lat: 34.52, event: '授左拾遗', type: '仕途' },
    { year: 759, location: '成都', lng: 104.07, lat: 30.67, event: '弃官入川筑草堂', type: '生活' },
    { year: 765, location: '夔州', lng: 109.47, lat: 31.04, event: '寓居夔州', type: '游历' },
    { year: 770, location: '湘江', lng: 112.97, lat: 28.23, event: '病逝于湘江舟中', type: '生活' },
  ],
  '辛弃疾': [
    { year: 1140, location: '济南', lng: 117.00, lat: 36.67, event: '出生于济南', type: '故里' },
    { year: 1161, location: '济南', lng: 117.00, lat: 36.67, event: '起义抗金', type: '仕途' },
    { year: 1162, location: '建康', lng: 118.78, lat: 32.06, event: '南归宋朝', type: '仕途' },
    { year: 1170, location: '临安', lng: 120.15, lat: 30.28, event: '上《美芹十论》', type: '仕途' },
    { year: 1181, location: '上饶', lng: 117.97, lat: 28.45, event: '闲居上饶带湖', type: '生活' },
    { year: 1192, location: '福州', lng: 119.30, lat: 26.08, event: '任福建提点刑狱', type: '仕途' },
    { year: 1203, location: '绍兴', lng: 120.58, lat: 30.00, event: '起任浙东安抚使', type: '仕途' },
    { year: 1207, location: '铅山', lng: 117.71, lat: 28.55, event: '病逝于铅山', type: '生活' },
  ],
  '李清照': [
    { year: 1084, location: '济南', lng: 117.00, lat: 36.67, event: '出生于济南', type: '故里' },
    { year: 1101, location: '汴京', lng: 114.35, lat: 34.80, event: '嫁赵明诚', type: '生活' },
    { year: 1107, location: '青州', lng: 118.48, lat: 36.69, event: '屏居青州', type: '生活' },
    { year: 1127, location: '青州', lng: 118.48, lat: 36.69, event: '靖康之变南渡', type: '流放' },
    { year: 1129, location: '建康', lng: 118.78, lat: 32.06, event: '赵明诚病逝', type: '生活' },
    { year: 1132, location: '杭州', lng: 120.15, lat: 30.28, event: '定居杭州', type: '生活' },
    { year: 1155, location: '杭州', lng: 120.15, lat: 30.28, event: '卒于杭州', type: '生活' },
  ],
  '王安石': [
    { year: 1021, location: '临川', lng: 116.36, lat: 27.95, event: '出生于临川', type: '故里' },
    { year: 1042, location: '汴京', lng: 114.35, lat: 34.80, event: '进士及第', type: '仕途' },
    { year: 1047, location: '鄞县', lng: 121.55, lat: 29.86, event: '任鄞县知县', type: '仕途' },
    { year: 1069, location: '汴京', lng: 114.35, lat: 34.80, event: '拜参知政事推行新法', type: '仕途' },
    { year: 1074, location: '江宁', lng: 118.78, lat: 32.06, event: '首次罢相', type: '仕途' },
    { year: 1076, location: '江宁', lng: 118.78, lat: 32.06, event: '二次罢相退居钟山', type: '生活' },
    { year: 1086, location: '江宁', lng: 118.78, lat: 32.06, event: '病逝于江宁', type: '生活' },
  ],
  '白居易': [
    { year: 772, location: '新郑', lng: 113.74, lat: 34.40, event: '出生于新郑', type: '故里' },
    { year: 800, location: '长安', lng: 108.94, lat: 34.26, event: '进士及第', type: '仕途' },
    { year: 807, location: '盩厔', lng: 108.33, lat: 34.16, event: '作《长恨歌》', type: '仕途' },
    { year: 815, location: '江州', lng: 116.00, lat: 29.71, event: '贬江州司马作《琵琶行》', type: '流放' },
    { year: 822, location: '杭州', lng: 120.15, lat: 30.28, event: '任杭州刺史修白堤', type: '仕途' },
    { year: 825, location: '苏州', lng: 120.62, lat: 31.30, event: '任苏州刺史', type: '仕途' },
    { year: 833, location: '洛阳', lng: 112.45, lat: 34.62, event: '退居洛阳', type: '生活' },
    { year: 846, location: '洛阳', lng: 112.45, lat: 34.62, event: '病逝于洛阳', type: '生活' },
  ],
  '欧阳修': [
    { year: 1007, location: '绵州', lng: 104.73, lat: 31.47, event: '出生于绵州', type: '故里' },
    { year: 1030, location: '汴京', lng: 114.35, lat: 34.80, event: '进士及第', type: '仕途' },
    { year: 1036, location: '夷陵', lng: 111.28, lat: 30.77, event: '贬夷陵令', type: '流放' },
    { year: 1045, location: '滁州', lng: 118.32, lat: 32.30, event: '贬滁州作《醉翁亭记》', type: '仕途' },
    { year: 1054, location: '汴京', lng: 114.35, lat: 34.80, event: '还朝任翰林学士', type: '仕途' },
    { year: 1070, location: '颍州', lng: 115.81, lat: 32.93, event: '退居颍州', type: '生活' },
    { year: 1072, location: '颍州', lng: 115.81, lat: 32.93, event: '病逝于颍州', type: '生活' },
  ],
  '陆游': [
    { year: 1125, location: '山阴', lng: 120.58, lat: 30.00, event: '出生于越州山阴', type: '故里' },
    { year: 1153, location: '临安', lng: 120.15, lat: 30.28, event: '应试被黜', type: '仕途' },
    { year: 1170, location: '南郑', lng: 107.03, lat: 33.07, event: '入蜀从军', type: '仕途' },
    { year: 1178, location: '成都', lng: 104.07, lat: 30.67, event: '蜀中任职', type: '仕途' },
    { year: 1186, location: '山阴', lng: 120.58, lat: 30.00, event: '闲居山阴作《书愤》', type: '生活' },
    { year: 1210, location: '山阴', lng: 120.58, lat: 30.00, event: '病逝临终作《示儿》', type: '生活' },
  ],
  '陶渊明': [
    { year: 365, location: '柴桑', lng: 115.99, lat: 29.71, event: '出生于浔阳柴桑', type: '故里' },
    { year: 393, location: '江州', lng: 116.00, lat: 29.71, event: '初仕江州祭酒', type: '仕途' },
    { year: 405, location: '彭泽', lng: 116.55, lat: 29.90, event: '任彭泽令后辞官归隐', type: '仕途' },
    { year: 408, location: '柴桑', lng: 115.99, lat: 29.71, event: '旧居遭火灾迁居', type: '生活' },
    { year: 427, location: '柴桑', lng: 115.99, lat: 29.71, event: '病逝于柴桑', type: '生活' },
  ],
  '李商隐': [
    { year: 813, location: '河内', lng: 112.93, lat: 35.09, event: '出生于怀州河内', type: '故里' },
    { year: 829, location: '郓州', lng: 116.58, lat: 35.60, event: '受知令狐楚', type: '仕途' },
    { year: 837, location: '长安', lng: 108.94, lat: 34.26, event: '进士及第', type: '仕途' },
    { year: 851, location: '梓州', lng: 105.09, lat: 31.65, event: '随柳仲郢入蜀', type: '仕途' },
    { year: 858, location: '郑州', lng: 113.65, lat: 34.76, event: '病逝于郑州', type: '生活' },
  ],
};

// 搜索建议列表
export const searchSuggestions = figures.map((f) => ({
  id: f.id,
  name: f.name,
  dynasty: f.dynasty,
  identity: f.identity[0],
}));
