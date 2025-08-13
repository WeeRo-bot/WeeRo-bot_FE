import axios from 'axios';
import { Platform } from 'react-native';

const baseURL =
  Platform.OS === 'web'
    ? 'http://localhost:8080'
    : 'http://192.168.0.8:8080'; // 팀원 PC IP

const instance = axios.create({
  baseURL,
});

export default instance;
