import { convertLocationToCoordinates } from '../../config/geoLocation.js';
import logger from '../../config/logger.js';

const MEILI_URL = process.env.MELISEARCH_BASE_URL || 'http://23.239.106.139:7700';
const MEILI_KEY = process.env.MELISEARCH_MASTER_KEY || 'uqgNSaNNO8lJD9Uz2EpEHUM2sRteso5j4wH2qQD1M';
const INDEX = 'projects';


type OriginalRole = {
    role_id: number;
    name: string | null | undefined;
    des?: string | null | undefined;
    number_of_people: number | undefined;
    gender_male?: number;
    gender_female?: number;
    age_min?: number | null | undefined;
    age_max?: number | null | undefined;
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
    ethnicity_mixed?: number;
    ethnicity_native_am?: number;
    ethnicity_x_asian?: number;
    ethnicity_x_black?: number;
    ethnicity_x_hispanic?: number;
    ethnicity_x_white?: number;
    ethnicity_american_in?: number;
    ethnicity_east_indian?: number;
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
    hairstyle_any?: number;
    hairstyle_afro?: number;
    hairstyle_bald?: number;
    hairstyle_buzz?: number;
    hairstyle_cons?: number;
    hairstyle_dread?: number;
    hairstyle_long?: number;
    hairstyle_medium?: number;
    hairstyle_shaved?: number;
    hairstyle_short?: number;
    eye_any?: number;
    eye_blue?: number;
    eye_b_g?: number;
    eye_brown?: number;
    eye_green?: number;
    eye_grey?: number;
    eye_g_b?: number;
    eye_g_g?: number;
    eye_hazel?: number;
    built_any?: number;
    built_medium?: number;
    built_athletic?: number;
    built_bb?: number;
    built_xlarge?: number;
    built_large?: number;
    built_petite?: number;
    built_thin?: number;
    built_lm?: number;
    built_average?: number;
    union_sag?: number;
    union_aftra?: number;
    character_type?: string | null | undefined;
    audition_timestamp?: number;
    shoot_timestamp?: number;
    expiration_timestamp?: number;
    last_modified?: number | null | undefined;
    status?: number;
    display_full?: number;
    is_archive?: number;
    // ...add any other fields you expect from Meilisearch
};

type OriginalDoc = {
    casting_id: number;
    status: number | null;
    user_id: number | null;
    address2: string | null;
    name: string | null | undefined;
    project: string | null;
    des: string | null;
    location: string | null;
    rate: string | number | null;
    rate_des: number | null;
    rate_scale: number | null;
    agency_rate: number | null;
    sub_timestamp: number | null;
    date_created: number | null;
    last_modified: number | null;
    asap: number | null;
    cat: number | null;
    market: string | null;
    snr_email: string | null;
    qlty_level: number | null;
    paid: string | number;
    roles: OriginalRole[];
    snr: number | null;
    union2: number | null;
    aud_timestamp: number | null;
    shoot_timestamp: number | null;
    // ...other fields omitted for brevity
};

export type oldOptimizedRole = {
    role_id: number;
    name: string;
    gender: string[];
    age_range: [number, number];
    ethnicity: string[];
    number_of_people: number;
    description: string;
    shoot_date: number | null;
    expiration_date: number | null;
    last_modified: number | null;
    status: number;
};


export type OptimizedRole = {
    role_id: number;
    name: string;
    gender: string[];
    age_range: {
        min: number;
        max: number;
    };
    ethnicity: string[];
    number_of_people: number;
    description: string;
    shoot_date: number | null;
    expiration_date: number | null;
    last_modified: number | null;
    status: number;
};
export type oldOptimizedDoc = {
    casting_id: number;
    status: number;
    user_id: number;
    title: string;
    project: string;
    description: string;
    location: {
        city: string;
        market: string;
    };
    address_url: string | null;
    rate: {
        amount: number;
        description: number;
        scale: number;
        agency_rate: number;
        paid: boolean;
        union: number;
    };
    dates: {
        submission: number | null;
        created: number | null;
        last_modified: number | null;
        asap: number | null;
        audition?: number | null;
        shoot?: number | null;
    };
    contact: {
        email: string | null;
    };
    quality_level: number;
    roles: oldOptimizedRole[];
    _geo: { lat: number, lng: number };
    categories: string;
    type: number;
};

export type OptimizedDoc = {
    casting_id: number;
    status: number;
    user_id: number;
    title: string;
    project: string;
    description: string;
    location: {
        city: string;
        market: string;
    };
    address_url: string | null;
    rate: {
        amount: number;
        description: number;
        scale: number;
        agency_rate: number;
        paid: boolean;
        union: number;
    };
    dates: {
        submission: number | null;
        created: number | null;
        last_modified: number | null;
        asap: number | null;
        audition?: number | null;
        shoot?: number | null;
    };
    contact: {
        email: string | null;
    };
    quality_level: number;
    roles: OptimizedRole[];
    _geo?: { lat: number, lng: number };
    categories: string;
    type: number;
};

export const CATEGORY_MAP: Record<string, number[]> = {
    'Commercials': [1],
    'Feature Film': [9, 10, 11, 12, 13, 14],
    'Infomercials': [15],
    'Crew': [16, 25, 34, 35, 36, 37, 38, 39, 40, 47, 48, 49, 50, 51, 52],
    'Dance': [3, 4, 5, 53, 54, 55, 56, 57, 58],
    'Music': [21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33],
    'Modeling': [17, 18, 19, 20],
    'Reality TV': [59],
    'Acting': [41, 42, 43, 61],
    'Variety': [44, 45, 46],
    'Other': [-1, 60]
};

export function convertRole(role: OriginalRole): OptimizedRole {
    const gender: string[] = [];
    if (role.gender_male) gender.push("male");
    if (role.gender_female) gender.push("female");

    const ethnicity: string[] = [];
    if (role.ethnicity_any) ethnicity.push("Any");
    if (role.ethnicity_african) ethnicity.push("African");
    if (role.ethnicity_african_am) ethnicity.push("African American");
    if (role.ethnicity_asian) ethnicity.push("Asian");
    if (role.ethnicity_caribbian) ethnicity.push("Caribbean");
    if (role.ethnicity_caucasian) ethnicity.push("Caucasian");
    if (role.ethnicity_hispanic) ethnicity.push("Hispanic");
    if (role.ethnicity_mediterranean) ethnicity.push("Mediterranean");
    if (role.ethnicity_middle_est) ethnicity.push("Middle East");
    if (role.ethnicity_mixed) ethnicity.push("Mixed");
    if (role.ethnicity_native_am) ethnicity.push("Native American");
    if (role.ethnicity_american_in) ethnicity.push("American Indian");
    if (role.ethnicity_east_indian) ethnicity.push("East Indian");
    
    if (ethnicity.length === 0) ethnicity.push("Any");

    const shoot_date = role.shoot_timestamp;
    const expiration_date = role.expiration_timestamp;
    const last_modified = role.last_modified;

    return {
        role_id: role.role_id,
        name: role.name || "",
        gender,
        age_range: {
            min: role.age_min || 1,
            max: role.age_max || 80
        },
        ethnicity,
        number_of_people: role.number_of_people || 1,
        description: role.des || "",
        shoot_date: shoot_date ?? null,
        expiration_date: expiration_date ?? null,
        last_modified: last_modified ?? null,
        status: role.status ?? 0,

    };
}



export async function convertDocument(doc: OriginalDoc): Promise<OptimizedDoc> {
    const categoryKeys = Object.keys(CATEGORY_MAP).filter(key => key !== '') as [keyof typeof CATEGORY_MAP, ...(keyof typeof CATEGORY_MAP)[]];
    const categories = categoryKeys.filter(key => CATEGORY_MAP[key].includes(doc.cat ?? -1)).join(',');
    const optimizedDoc: OptimizedDoc = {
        casting_id: doc.casting_id,
        status: doc.status ?? 0,
        user_id: doc.user_id ?? 0,
        title: doc.name || '',
        project: doc.project || '',
        description: doc.des || '',
        location: {
            city: doc.location || '',
            market: doc.market || '',
        },
        address_url: doc.address2,
        rate: {
            amount: doc.rate == null ? 0 : (typeof doc.rate === "string" ? parseFloat(doc.rate) : doc.rate),
            description: doc.rate_des ?? 0,
            scale: doc.rate_scale ?? 0,
            agency_rate: doc.agency_rate ?? 0,
            paid: doc.paid === "1" || doc.paid === 1,
            union: doc.union2 ?? 0
        },
        dates: {
            submission: doc.sub_timestamp,
            created: doc.date_created,
            last_modified: doc.last_modified,
            asap: doc.asap,
            audition: doc?.aud_timestamp,
            shoot: doc?.shoot_timestamp
        },
        contact: {
            email: doc.snr_email,
        },
        quality_level: doc.qlty_level ?? 0,
        roles: doc.roles.map(convertRole),
        categories: categories,
        type: doc.snr ?? 0,
    };

    try {
        if (doc.location == null || ['united states', 'n/a'].includes(doc.location.toLocaleLowerCase())) {
            optimizedDoc._geo = {
                lat: 38.7945952,
                lng: -106.5348379
            };
        }
        else {
            const geo = await convertLocationToCoordinates(doc.location);
            optimizedDoc._geo = geo;
        }
    } catch (error) {
        logger.error(`Error converting location to coordinates for casting_id ${doc.casting_id}`, error);
        optimizedDoc._geo = {
            lat: 38.7945952,
            lng: -106.5348379
        };
    }
    return optimizedDoc;
}

export async function checkIfCastingInMelisearch(casting_id: number) {
    // if the casting is not in melisearch or the last_modified is less than the last_modified in the database, return false. We can proceeed with adding/updating the document.

    const res = await fetch(`${MEILI_URL}/indexes/${INDEX}/documents/${casting_id}`, {
        headers: {
            'Authorization': `Bearer ${MEILI_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) {
        return false;
    }
    else {
        return true;
    }
}