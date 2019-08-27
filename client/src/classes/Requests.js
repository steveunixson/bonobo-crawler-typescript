import axios from 'axios';

export default class Requests {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/',
      timeout: 2000,
    });
  }

  async twogis() {
    await this.axiosInstance.post('twogis', []);
  }
}
