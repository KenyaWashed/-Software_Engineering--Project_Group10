// Định nghĩa kiểu dữ liệu cho policy phụ thu
export interface SurchargePolicy {
  policy_short_name: string;
  policy_name: string;
  policy_value: number;
}

export interface SurchargePolicyResponse {
  policies: SurchargePolicy[];
}
