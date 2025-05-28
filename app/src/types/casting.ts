// 'use strict'

// import _ from 'lodash'
// import date from 'src/services/date.js'

// export interface CastingData {
//   rate_des: number;
//   rate: string;
//   cat: number;
//   project_type: number;
//   zip?: string;
//   name: string;
//   location: string;
//   casting_id: string;
//   [key: string]: any;
// }

// export default class Casting {
//   [key: string]: any;

//   constructor(data: CastingData) {
//     _.extend(this, data)
//   }

//   getRate(): string {
//     let rates = [
//       'N/A' ,
//       'Per Event',
//       'Per Hour',
//       'Per Day',
//       'Per Week',
//       'Per Month',
//       'Negotiable'
//     ]

//     return rates[this.rate_des]
//   }

//   getRateText(): string {
//     if (this.rate_des == 0 || this.rate_des == 6) {
//       return this.getRate()
//     }

//     return this.rate + ' ' + this.getRate()
//   }

//   getCategory(): string {
    // let categories = {
    //   0: '',
    //   1: 'Commercials',
    //   10: 'Feature Film - Non-SAG',
    //   11: 'Feature Film - Student Films',
    //   12: 'Feature Film - Short Film',
    //   13: 'Feature Film - Documentaries',
    //   14: 'Feature Film - Inde/Low Budget',
    //   15: 'Infomercials',
    //   16: 'Crew - Assistants & Entry Level',
    //   17: 'Industrial/Training Films',
    //   18: 'Modeling - Runway',
    //   19: 'Modeling - Hair/Cosmetics',
    //   20: 'Modeling - Print',
    //   21: 'Music Videos',
    //   22: 'Theatre - Equity (Union)',
    //   23: 'Theatre - Non-Equity',
    //   24: 'Trade Shows/Live Events/Promo Model',
    //   25: 'Crew - Marketing/PR',
    //   26: 'Voice Over',
    //   27: 'Internet',
    //   28: 'Music - Vocals',
    //   29: 'Music - Strings',
    //   3: 'Dance - Ballet/Classic',
    //   30: 'Music - Horns',
    //   31: 'Music - Keyboards',
    //   32: 'Music - Drums',
    //   33: 'Music - Other',
    //   34: 'Crew - Ligthing/Sound',
    //   35: 'Crew - Camera/Editor',
    //   36: 'Crew - Producer/Director',
    //   37: 'Crew - Make Up/Stylist',
    //   38: 'Crew - Other',
    //   39: 'Crew - Writing/Script/Edit',
    //   4: 'Dance - Modern/Jazz',
    //   40: 'Crew - Showbiz Internship',
    //   41: 'Acting - Comedy/Clown',
    //   42: 'Variety - Variety Acts',
    //   43: 'Acting - Acrobatics/Stunts',
    //   44: 'Music - Band',
    //   45: 'Music - DJ/Sound',
    //   46: 'Music - Teacher',
    //   47: 'Crew - TV/Radio',
    //   48: 'Crew - Graphic/Web/Animate',
    //   49: 'Crew - Accounting/Payroll/HR',
    //   5: 'Episodic TV - Pilots',
    //   50: 'Crew - Technology/MIS',
    //   51: 'Crew - Management',
    //   52: 'Crew - Talent/Casting Mgmt',
    //   53: 'Dance - HipHop',
    //   54: 'Dance - Club/Gogo',
    //   55: 'Dance - Traditonal/Latin',
    //   56: 'Dance - Choreography',
    //   57: 'Dance - Teacher',
    //   58: 'Dance - Other/General',
    //   59: 'Reality TV',
    //   6: 'Episodic TV - SAG',
    //   60: 'Extras',
    //   61: 'Acting - Other',
    //   7: 'Episodic TV - AFTRA',
    //   8: 'Episodic TV - Non-Union',
    //   9: 'Feature Film - SAG'
    // }

//     return categories[this.cat]
//   }

//   getProjectType(): string {
//     let projectTypes = {
//       0: 'Commercials',
//       1: 'Print',
//       2: 'Music Video',
//       3: 'Feature Film',
//       4: 'SAG Experm',
//       5: 'Episodic',
//       6: 'Pilots',
//       7: 'Voice Over',
//       8: 'Live Event',
//       9: 'Infomercial',
//       10: 'Doc. Short Film',
//       11: 'TV Show',
//       12: 'Music',
//       13: 'Crew',
//       14: 'Dance'
//     }

//     return projectTypes[this.project_type]
//   }

//   convertToFullDate(timestamp: number | string): string {
//     return date.formatYMD(parseInt(timestamp as string))
//   }

//   getUrl(): string {
//     if (this.zip) {
//       return 'https://www.exploretalent.com/auditions/' + this.normalize(this.getCategory()) + '-' +
//         this.normalize(this.name) + '-' +
//         this.normalize(this.location) + '-' +
//         this.normalize(this.zip) + '_' +
//         this.normalize(this.casting_id)
//     } else {
//       return 'https://www.exploretalent.com/auditions/' + this.normalize(this.getCategory()) + '-' +
//         this.normalize(this.name) + '-' +
//         this.normalize(this.location) + '-' +
//         this.normalize(this.casting_id)
//     }
//   }

//   normalize(url: string): string {
//     url = url + ''
//     let str = url.replace(/[^a-zA-Z0-9-_ ]/, '')
//     let strs = str.toLowerCase().split(' ')

//     _.remove(strs, function (s) {
//       return s.trim() == ''
//     })

//     str = strs.join('-')
//     strs = str.toLowerCase().split('-')

//     _.remove(strs, function (s) {
//       return (s.trim() == '' || s.trim() == '-')
//     })

//     str = strs.join('_')
//     strs = str.toLowerCase().split('_')

//     _.remove(strs, function (s) {
//       return (s.trim() == '' || s.trim() == '_')
//     })

//     return strs.join('-')
//   }

//   static relationship = [
//     'data:bam_castings',
//     'bam_cd_user',
//     'bam_roles'
//   ]
// }

type RateType = 'N/A' | 'Per Event' | 'Per Hour' | 'Per Day' | 'Per Week' | 'Per Month' | 'Negotiable';
enum CategoryEnum {
  '' = 0,
  'Commercials' = 1,
  'Feature Film - Non-SAG' = 10,
  'Feature Film - Student Films' = 11,
  'Feature Film - Short Film' = 12,
  'Feature Film - Documentaries' = 13,
  'Feature Film - Inde/Low Budget' = 14,
  'Infomercials' = 15,
  'Crew - Assistants & Entry Level' = 16,
  'Industrial/Training Films' = 17,
  'Modeling - Runway' = 18,
  'Modeling - Hair/Cosmetics' = 19,
  'Modeling - Print' = 20,
  'Music Videos' = 21,
  'Theatre - Equity (Union)' = 22,
  'Theatre - Non-Equity' = 23,
  'Trade Shows/Live Events/Promo Model' = 24,
  'Crew - Marketing/PR' = 25,
  'Voice Over' = 26,
  'Internet' = 27,
  'Music - Vocals' = 28,
  'Music - Strings' = 29,
  'Dance - Ballet/Classic' = 3,
  'Dance - Modern/Jazz' = 4,
  'Dance - HipHop' = 53,
  'Dance - Club/Gogo' = 54,
  'Dance - Traditonal/Latin' = 55,
  'Dance - Choreography' = 56,
  'Dance - Teacher' = 57,
  'Dance - Other/General' = 58,
  'Reality TV' = 59,
  'Acting - Comedy/Clown' = 41,
  'Variety - Variety Acts' = 42,
  'Acting - Acrobatics/Stunts' = 43,
  'Music - Band' = 44,
  'Music - DJ/Sound' = 45,
  'Music - Teacher' = 46,
  'Crew - TV/Radio' = 47,
  'Crew - Graphic/Web/Animate' = 48,
  'Crew - Accounting/Payroll/HR' = 49,
  'Crew - Technology/MIS' = 50,
  'Crew - Management' = 51,
  'Crew - Talent/Casting Mgmt' = 52,
  'Acting - Other' = 61,
  'Acting - SAG' = 6,
  'Acting - AFTRA' = 7,
  'Acting - Non-Union' = 8,
  'Feature Film - SAG' = 9,
  'Extras' = 60,
  'Crew - Other' = 38,
  'Crew - Writing/Script/Edit' = 39,
  'Crew - Make Up/Stylist' = 37,
  'Crew - Producer/Director' = 36,
  'Crew - Camera/Editor' = 35,
  'Crew - Ligthing/Sound' = 34,
  'Crew - Showbiz Internship' = 40,
}

// interface CastingProject {
//   rates: RateType;
// }

