
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
