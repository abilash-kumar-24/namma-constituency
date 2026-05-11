export interface Representative {
  id: string;
  candidate_id?: string;
  name: string;
  constituency: string;
  district: string;
  party: string;
  party_short: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  education: string;
  profession: string;
  criminal_cases: number;
  serious_criminal_cases: number;
  assets: string;
  assets_raw: number; // in lakhs
  liabilities: string;
  liabilities_raw: number; // in lakhs
  affidavit_url: string;
  photo_url?: string;
  num_candidates?: number;
  source_name: string;
  source_url: string;
  photo_placeholder: string; // initials fallback color
  term_start: number;
  constituency_no: string;
}

export interface DistrictIndicator {
  metric_name: string;
  metric_value: string;
  metric_numeric: number;
  unit: string;
  year: number;
  explanation: string;
  source_name: string;
  source_url: string;
  trend: "up" | "down" | "stable";
  trend_note: string;
  icon: string;
  type: "core" | "highlight";
  accuracy: "official" | "approximate" | "estimated";
}

export interface DistrictIndicatorGroup {
  district: string;
  indicators: DistrictIndicator[];
}

export interface LegislatureActivity {
  constituency_id: string;
  has_prior_record: boolean;
  is_incumbent: boolean;
  prev_mla_name?: string;
  prev_constituency?: string;
  questions_asked: number | null;
  state_avg_questions: number;
  is_minister_excluded?: boolean;
  is_speaker_excluded?: boolean;
  term: string;
  data_window: string;
  source_name: string;
  source_url: string;
  reason?: string;
}

export interface IssueGuidance {
  id: string;
  category: string;
  icon: string;
  color: string;
  likely_department: string;
  what_to_prepare: string[];
  expected_resolution_type: string;
  guidance_note: string;
  portal_name: string;
  portal_url: string;
}

export interface SearchResult {
  representative: Representative;
  indicators: DistrictIndicator[];
}
