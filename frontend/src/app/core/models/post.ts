export interface Owner {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;

  origin: string;
  destination: string;

  travelDate: string;
  travelTime: string;

  availableSeats: number;

  notes: string;

  status: string;

  ownerId: string;

  createdAt: string;
  updatedAt: string;

  owner: Owner;
}