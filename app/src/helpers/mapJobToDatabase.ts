import { CategoryEnum, MappedJob } from '../types/casting.js';
import logger from '../config/logger.js';
import { Listing } from '../app/project_casting/scrape_listings.js';
import { getCurrentTimestamp, parseDateToTimestamp } from '../utils/dateUtils.js';

function getDomain(url: string): string | null {
    try {
        const domain = new URL(url).hostname;
        return domain;
    } catch (error) {
        return null;
    }
}

export async function mapJobToDatabase(listing: Listing, user: {id: number, email: string}): Promise<MappedJob> {
    try {
        const currentTime = getCurrentTimestamp();
        const returnData: MappedJob = {
            name: listing.title,
            name_original: `"${listing.title}"`,
            project: listing.title,
            address2: listing.job_url,
            location: listing.location,
            market: listing.location,
            cat: CategoryEnum[listing.category === 'Events' ? 'Trade Shows/Live Events/Promo Model' : listing.category] || 0,
            rate: listing.rate || 262,
            rate_des: 6,
            des: listing.description,
            union2: listing.union_job ? 1 : 0,
            sub_timestamp: currentTime,
            date_created: currentTime,
            last_modified: currentTime,
            status: 1,
            source: getDomain(listing.job_url) || listing.job_url,
            required_phone: '0',
            required_photo: '0',
            expected_time: '0',
            paid: 1,
            notify_through: '0',
            snr: user.id,
            snr_email: user.email,
            asap: parseDateToTimestamp(listing.expiration_date),
        };
        
        return returnData;
    } catch (error) {
        logger.error('Error mapping job to database format:', error);
        throw error;
    }
} 