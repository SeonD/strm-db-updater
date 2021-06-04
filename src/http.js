import axios from 'axios';
import { API_URL } from './config';
import { logger } from './utils/logger';

logger.info(`${API_URL}/api/v1/docs`);
const getDoc = (docId) => axios.get(`${API_URL}/docs/${docId}`);

export { getDoc };
