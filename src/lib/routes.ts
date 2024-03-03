export const routes = {
  root: "/",
  favorites: {
    root: "/favorites",
  },
  settings: {
    root: "/settings",
  },
  barbershops: {
    root: "/barbershops",
    registration: {
      root: "/barbershops/registration",
    },
  },
  barbers: {
    root: "/barbers",
    registration: {
      root: "/barbers/registration",
    },
  },
  reservations: {
    root: "/reservations",
  },
  barber: {
    root: "/barber",
    schedule: {
      root: "/barber/schedule",
    },
    invitations: {
      root: "/barber/invitations",
    },
    barberDetails: {
      root: "/barber/details",
    },
    settings: {
      root: "/barber/settings",
    },
  },
  owner: {
    root: "/owner",
    openingHours: {
      root: "/owner/opening-hours",
      edit: {
        root: "/owner/opening-hours/edit",
      },
    },
    barbershopDetails: {
      root: "/owner/barbershop-details",
    },
    preferences: {
      root: "/owner/preferences",
    },
    priceList: {
      root: "/owner/price-list",
    },
    reservations: {
      root: "/owner/reservations",
    },
    barbers: {
      root: "/owner/barbers",
    },
    settings: {
      root: "/owner/settings",
    },
  },
};
