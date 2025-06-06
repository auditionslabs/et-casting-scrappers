
export type Role = {
    expiration_timestamp: number;
    audition_timestamp?: number;
    shoot_timestamp?: number;
    name?: string;
    number_of_people?: number;
    des?: string;
    gender_male: number | 0;
    gender_female: number | 0;
    age_min: number | 3;
    age_max: number | 80;
    height_min?: number;
    height_max?: number;
    ethnicity_any?: number;
    ethnicity_african?: number;
    ethnicity_african_am?: number;
    ethnicity_asian?: number;
    ethnicity_caribbian?: number;
    ethnicity_caucasian?: number;
    ethnicity_hispanic?: number;
    ethnicity_mediterranean?: number;
    ethnicity_middle_est?: number;
    built_any?: number;
    built_medium?: number;
    built_athletic?: number;
    built_bb?: number;
    built_xlarge?: number;
    built_large?: number;
    built_petite?: number;
    built_thin?: number;
    built_lm?: number;
    hair_any?: number;
    hair_auburn?: number;
    hair_black?: number;
    hair_blonde?: number;
    hair_brown?: number;
    hair_chestnut?: number;
    hair_dark_brown?: number;
    hair_grey?: number;
    hair_red?: number;
    hair_salt_paper?: number;
    hair_white?: number;
}


