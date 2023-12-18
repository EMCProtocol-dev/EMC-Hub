export type Numerical = {
  name: string;
  value: number;
};

export type Item = {
  link: string;
  cover: string;
  publisherAvatar: string;
  publisherName: string;
  numericals: Numerical[];
};
