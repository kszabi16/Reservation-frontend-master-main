export interface PropertySearchDto {
    propertyId: string;
    title: string;
    location: string;
    pricePerNight: number;
    amenitiesList: string;
    mainImageUrl: string;
    relevancyScore?: number;
}