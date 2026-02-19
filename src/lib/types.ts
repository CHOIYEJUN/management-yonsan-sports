export interface Instructor {
  id: string;
  name: string;
  currentCenter: string;
  category: string;
  position: string;
  imageUrl?: string;
  /** 성별 (남자/여자 표시용) */
  gender?: "male" | "female";
  /** 담당 강습(반) 목록 */
  assignedClasses?: string[];
  licenses: string[];
  career: string[];
}

export interface Center {
  id: string;
  name: string;
  icon: string;
  /** 사업장 간략 주소 (시설선택 하단 표기용) */
  address?: string;
  /** 전화번호 */
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
