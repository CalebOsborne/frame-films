export type TicketLocation = {
  zip: string;
  city?: string;
  state?: string;
  latitude: number;
  longitude: number;
  label: string;
};

export type ShowtimeSlot = {
  id: string;
  time: string;
  screenReaderTime: string;
  format?: string;
  soldOut: boolean;
  ticketUrl: string;
  ticketProvider: string;
};

export type TheaterShowtimes = {
  id: string;
  name: string;
  chainCode?: string;
  chainName?: string;
  address: string;
  cityStateZip: string;
  distanceMiles: number;
  showtimes: ShowtimeSlot[];
};

export type NearbyShowtimesResult = {
  theaters: TheaterShowtimes[];
  date: string;
  zip: string;
  movieTitle: string;
};

export type SavedTheater = {
  id: string;
  name: string;
  savedAt: string;
};
