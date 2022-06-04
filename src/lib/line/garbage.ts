const GARBAGE_MONDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_MONDAY");
const GARBAGE_TUESDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_TUESDAY");
const GARBAGE_WEDNESDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_WEDNESDAY");
const GARBAGE_THURSDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_THURSDAY");
const GARBAGE_FRIDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_FRIDAY");
const GARBAGE_SATURDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_SATURDAY");
const GARBAGE_SUNDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_SUNDAY");

export function getTomorrowGarbageInfo() {
  const todayWeekNum = new Date().getDay();
  const tomorrowWeekNum = todayWeekNum === 6
    ? 0
    : todayWeekNum + 1;
  const weekDays = [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日"
  ];
  const garbages = [
    GARBAGE_SUNDAY,
    GARBAGE_MONDAY,
    GARBAGE_TUESDAY,
    GARBAGE_WEDNESDAY,
    GARBAGE_THURSDAY,
    GARBAGE_FRIDAY,
    GARBAGE_SATURDAY,
  ]
  const tomorrowDay = weekDays[tomorrowWeekNum];
  const tomorrowGarbage = garbages[tomorrowWeekNum];
  const message = `明日は${tomorrowDay}
${tomorrowGarbage} の日

  `
  console.log(message);
  return message;
}

/**
 * ゴミ出しの情報一覧取得
 */
export function getGarbageInfoList() {
  const MondayInfo = GARBAGE_MONDAY;
  const TuesdayInfo = GARBAGE_TUESDAY;
  const WednesdayInfo = GARBAGE_WEDNESDAY;
  const ThursdayInfo = GARBAGE_THURSDAY;
  const FridayInfo = GARBAGE_FRIDAY;
  const SaturdayInfo = GARBAGE_SATURDAY;
  const SundayInfo = GARBAGE_SUNDAY;
  const message = `ゴミ出しの日一覧

  月曜日: ${MondayInfo}
  火曜日: ${TuesdayInfo}
  水曜日: ${WednesdayInfo}
  木曜日: ${ThursdayInfo}
  金曜日: ${FridayInfo}
  土曜日: ${SaturdayInfo}
  日曜日: ${SundayInfo}
  `
  return message;
}
