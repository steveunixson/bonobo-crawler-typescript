/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

/* eslint-disable semi */
import { Document } from 'mongoose';

export default interface TwogisModelInterface extends Document {
  id: number;
  phoneNumber: string;
  companyName: string;
  address: string;
  city: string;
  site: string;
  search: string;
  tags: string;
  hours: string;
}
