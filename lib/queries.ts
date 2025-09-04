import {client} from "@/client";

export const categoriesQuery = `*[_type == "category"]{
  _id,
  title,
  "slug": slug.current,
  description,
  "icon": icon.asset->url,
  "coverImage": coverImage.asset->url,
  "useCoverImageAsIcon": useCoverImageAsIcon,
   "provider": provider->{
    _id,
  name,
  slug,
  description,
  avatar {
    asset->{
      _id,
      url
    }
  },
  role,
  phoneNumber,
  whatsappNumber
  }
}`;

export const providerQuery  = `*[_type == "provider"]{
  _id,
  name,
  slug,
  description,
  avatar {
    asset->{
      _id,
      url
    }
  },
  role,
  phoneNumber,
  whatsappNumber
}`;

export const featuredServicesQuery = `
  *[_type == "service" && featured == true] | order(_createdAt asc) {
    _id,
    title,
    image,
    description,
    slug,
    badges
  }
`;
export const bookingPeriodsQuery = `
  *[_type == "bookingPeriod"]{
    _id,
    title,
    colorTunisia,
    colorSweden,
    slots[]{ 
      date,
      place,
      startTime,
      endTime
    }
  }
`;



export const getBookingSlotByDate = async (date: string) => {
    return await client.fetch(
        `*[_type == "bookingPeriod" && slots[].date == $date][0]{
      _id,
      title,
      slots[date == $date]{
        date,
        place,
        startTime,
        endTime
      }
    }`,
        { date }
    );
};
export const getBookingPeriodById = async (id: string) => {
    return await client.fetch(
        `*[_type == "bookingPeriod" && _id == $id][0]{
      title,
      slots[]{
        date,
        place,
        startTime,
        endTime
      }
    }`,
        { id }
    );
};
export const getAllBookingPeriods = async () => {
    return await client.fetch(`
    *[_type == "bookingPeriod"]{
      _id,
      title,
      colorTunisia,
      colorSweden,
      slots[]{ 
        date,
        place,
        startTime,
        endTime
      }
    }
  `);
};