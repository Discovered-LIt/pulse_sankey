import axios from '../config/axios';
// types
import { SliderMappingDataProps } from '../context/SlidderContext';

export const fetchSlidderMapping = async (): Promise<{ data: SliderMappingDataProps[] }> => {
  return axios.get('modalmappingv2.json')
}
