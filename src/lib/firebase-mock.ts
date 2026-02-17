// 타입 및 목 데이터 (센터/종목은 UI 선택용으로 유지)
import type { Center, Category } from "./types";
export type { Instructor, Center, Category } from "./types";

// 시설 목록 (시설 선택) - 표시 순서
export const mockCenters: Center[] = [
  { id: "center4", name: "문화체육센터", icon: "building-2", address: "용산구 백범로 350", phone: "02-707-2494" },
  { id: "center2", name: "용산청소년센터", icon: "school", address: "용산구 이촌로71길 24", phone: "070-4906-2606" },
  { id: "center1", name: "꿈나무종합타운", icon: "building-2", address: "용산구 백범로 329", phone: "02-707-0704" },
  { id: "center5", name: "이태원초등학교수영장", icon: "waves", address: "용산구 녹사평대로 40길 19", phone: "02-797-2492" },
  { id: "center6", name: "한강로피트니스센터", icon: "dumbbell", address: "용산구 서빙고로17 지하1층", phone: "02-798-5019" },
  { id: "center3", name: "원효로다목적체육관", icon: "building", address: "용산구 원효로3가 51-26", phone: "02-707-2492" },
];

// 종목 목록 (종목별 강사 찾기 전체 + 시설별 종목 필터용)
export const mockCategories: Category[] = [
  { id: "cat1", name: "수영", icon: "waves" },
  { id: "cat2", name: "헬스", icon: "dumbbell" },
  { id: "cat3", name: "생활체육", icon: "bike" },
  { id: "cat4", name: "기구필라테스", icon: "circle-dot" },
  { id: "cat5", name: "문화강좌", icon: "book-open" },
  { id: "cat6", name: "서킷핏", icon: "activity" },
];

// 시설별 종목 구성
const centerCategoryNames: Record<string, string[]> = {
  꿈나무종합타운: ["생활체육", "문화강좌"],
  용산청소년센터: ["수영", "헬스", "생활체육", "문화강좌"],
  원효로다목적체육관: ["생활체육"],
  문화체육센터: ["수영", "헬스", "생활체육", "기구필라테스", "문화강좌"],
  이태원초등학교수영장: ["수영", "서킷핏", "기구필라테스"],
  한강로피트니스센터: ["헬스", "생활체육", "기구필라테스"],
};

/** 선택한 시설에서 제공하는 종목만 반환 */
export function getCategoriesForCenter(centerName: string): Category[] {
  const names = centerCategoryNames[centerName];
  if (!names?.length) return [];
  return mockCategories.filter((c) => names.includes(c.name));
}
