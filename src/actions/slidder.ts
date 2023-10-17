import axios from 'axios';
import axiosInstance from '../config/axios';
// types
import { SliderMappingDataProps } from '../context/SlidderContext';

export const fetchSlidderMapping = async (): Promise<{ data: SliderMappingDataProps[] }> => {
  return axiosInstance.get('modalmappingv2.json')
}

export const saveSlidderValues = async (): Promise<any> => {
  return axios.post('https://y8twn5kxlf.execute-api.us-east-1.amazonaws.com/default/Pulse_Demo')
}
