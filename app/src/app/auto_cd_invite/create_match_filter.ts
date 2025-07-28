export function getMatchesFilter(role: any, project: any, options?: any, app_filter?: any) {
    let query: any[] = [
    ];

    if (options) {
        if (options.has_photos !== undefined) {
            query.push(['where', 'has_photos', '=', options.has_photos]);
        }

        if (options.regdate_from && options.regdate_to) {
            query.push(['where', 'date_entered', '<=', options.regdate_to]);
            query.push(['where', 'date_entered', '>=', options.regdate_from]);
        }
    }

    if (app_filter) {
        query.push(['whereIn', 'x_origin', app_filter]);
    }

    if (parseInt(role.age_min)) {
        query.push(['where', 'dobyyyy', '<=', new Date().getFullYear() - parseInt(role.age_min)]);
    }

    if (parseInt(role.age_max)) {
        query.push(['where', 'dobyyyy', '>=', new Date().getFullYear() - parseInt(role.age_max)]);
    }

    if (parseInt(role.height_min)) {
        query.push(['where', 'heightinches', '>=', role.height_min]);
    }

    if (parseInt(role.height_max)) {
        query.push(['where', 'heightinches', '<=', role.height_max]);
    }

    // markets
    if (project && project.location) {
        const markets = project.location.split('>');
        const nationwide = markets.find((market: string) => market === 'N/A');

        if (markets.length && !nationwide) {
            let subquery: any[] = [];

            markets.forEach((market: string) => {
                if (subquery.length === 0) {
                    subquery.push(['where', 'city', 'like', '%' + market + '%']);
                } else {
                    subquery.push(['orWhere', 'city', 'like', '%' + market + '%']);
                }

                subquery.push(['orWhere', 'city1', 'like', '%' + market + '%']);
                subquery.push(['orWhere', 'city2', 'like', '%' + market + '%']);
                subquery.push(['orWhere', 'city3', 'like', '%' + market + '%']);
            });

            query.push(['where', subquery]);
        }
        else if (nationwide) {
            let subquery: any[] = [];

            subquery.push(['where', 'city', 'like', '%%']);
            subquery.push(['orWhere', 'city1', 'like', '%%']);
            subquery.push(['orWhere', 'city2', 'like', '%%']);
            subquery.push(['orWhere', 'city3', 'like', '%%']);

            query.push(['where', subquery]);
        }
    }

    // gender - using the getGenders logic
    const genders = getGenders(role);
    if (genders.length) {
        let subquery: any[] = [];

        genders.forEach((gender: string) => {
            if (subquery.length === 0) {
                subquery.push(['where', 'sex', '=', gender]);
            } else {
                subquery.push(['orWhere', 'sex', '=', gender]);
            }
        });

        query.push(['where', subquery]);
    }

    // ethnicity - using the getEthnicities logic
    const ethnicities = getEthnicities(role);
    if (ethnicities.length) {
        let subquery: any[] = [];

        ethnicities.forEach((ethnicity: string) => {
            if (subquery.length === 0) {
                subquery.push(['where', 'ethnicity', '=', ethnicity]);
            } else {
                subquery.push(['orWhere', 'ethnicity', '=', ethnicity]);
            }
        });

        query.push(['where', subquery]);
    }

    // body type/build - using the getBuilds logic
    const builds = getBuilds(role);
    if (builds.length) {
        let subquery: any[] = [];

        builds.forEach((build: string) => {
            if (subquery.length === 0) {
                subquery.push(['where', 'build', '=', build]);
            } else {
                subquery.push(['orWhere', 'build', '=', build]);
            }
        });

        query.push(['where', subquery]);
    }

    // hair color - using the getHairColors logic
    const haircolors = getHairColors(role);
    if (haircolors.length) {
        let subquery: any[] = [];

        haircolors.forEach((haircolor: string) => {
            if (subquery.length === 0) {
                subquery.push(['where', 'haircolor', '=', haircolor]);
            } else {
                subquery.push(['orWhere', 'haircolor', '=', haircolor]);
            }
        });

        query.push(['where', subquery]);
    }

    // hair style - using the getHairStyles logic
    const hairstyles = getHairStyles(role);
    if (hairstyles.length) {
        let subquery: any[] = [];

        hairstyles.forEach((hairstyle: string) => {
            if (subquery.length === 0) {
                subquery.push(['where', 'hairstyle', '=', hairstyle]);
            } else {
                subquery.push(['orWhere', 'hairstyle', '=', hairstyle]);
            }
        });

        query.push(['where', subquery]);
    }

    // eye color - using the getEyeColors logic
    const eyecolors = getEyeColors(role);
    if (eyecolors.length) {
        let subquery: any[] = [];

        eyecolors.forEach((eyecolor: string) => {
            if (subquery.length === 0) {
                subquery.push(['where', 'eyecolor', '=', eyecolor]);
            } else {
                subquery.push(['orWhere', 'eyecolor', '=', eyecolor]);
            }
        });

        query.push(['where', subquery]);
    }

    return query;
}

// Helper functions to replace the getter methods
function getGenders(role: any): string[] {
    const array: string[] = [];

    if (role.gender_male == 1) {
        array.push('Male');
    }

    if (role.gender_female == 1) {
        array.push('Female');
    }

    if (array.length > 1) {
        return [];
    }

    return array;
}

function getEthnicities(role: any): string[] {
    const array: string[] = [];

    const ethnicities: { [key: string]: string } = {
        african: 'African',
        african_am: 'African American',
        asian: 'Asian',
        carribian: 'Caribbean',
        caucasian: 'Caucasian',
        hispanic: 'Hispanic',
        mediterranean: 'Mediterranean',
        middle_est: 'Middle Eastern',
        mixed: 'Mixed',
        native_am: 'American',
        american_in: 'American Indian',
        east_indian: 'East Indian'
    };

    if (role.ethnicity_any == 1) {
        return [];
    }

    for (const e in ethnicities) {
        if (role['ethnicity_' + e] == 1) {
            array.push(ethnicities[e]);
        }
    }

    return array;
}

function getHairColors(role: any): string[] {
    const array: string[] = [];

    const haircolors: { [key: string]: string } = {
        auburn: 'Auburn',
        black: 'Black',
        blonde: 'Blonde',
        brown: 'Brown',
        chestnut: 'Chestnut',
        dark_brown: 'Dark Brown',
        grey: 'Grey',
        red: 'Red',
        white: 'White',
        salt_pepper: 'Salt&Peppe'
    };

    if (role.hair_any == 1) {
        return [];
    }

    for (const color in haircolors) {
        if (role['hair_' + color] == 1) {
            array.push(haircolors[color]);
        }
    }

    return array;
}

function getHairStyles(role: any): string[] {
    const array: string[] = [];

    const hairstyles: { [key: string]: string } = {
        afro: 'Afro',
        bald: 'Bald',
        buzz: '',
        cons: 'Conservati',
        dread: 'Dreadlocks',
        long: 'Long',
        medium: 'Medium',
        shaved: 'Shaved',
        short: 'Short'
    };

    if (role.hairstyle_any == 1) {
        return [];
    }

    for (const style in hairstyles) {
        if (role['hairstyle_' + style] == 1) {
            array.push(hairstyles[style]);
        }
    }

    return array;
}

function getEyeColors(role: any): string[] {
    const array: string[] = [];

    const eyecolors: { [key: string]: string } = {
        blue: 'Blue',
        b_g: 'Blue-Green',
        brown: 'Brown',
        green: 'Green',
        grey: 'Grey',
        g_b: 'Grey-Blue',
        g_g: 'Grey-Green',
        hazel: 'Hazel'
    };

    if (role.eye_any == 1) {
        return [];
    }

    for (const color in eyecolors) {
        if (role['eye_' + color] == 1) {
            array.push(eyecolors[color]);
        }
    }

    return array;
}

function getBuilds(role: any): string[] {
    const array: string[] = [];

    const builds: { [key: string]: string } = {
        medium: 'Medium',
        athletic: 'Athletic',
        bb: 'Muscular',
        xlarge: 'Extra Large',
        large: 'Large',
        petite: 'Petite',
        thin: 'Slim',
        lm: 'Lean Muscle',
        average: 'Average'
    };

    if (role.built_any == 1) {
        return [];
    }

    for (const b in builds) {
        if (role['built_' + b] == 1) {
            array.push(builds[b]);
        }
    }

    return array;
}