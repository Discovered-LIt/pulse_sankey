import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  PropsWithChildren
} from 'react';
// types
import { SlidderCategory } from "../config/sankey";
// actions
import { fetchSlidderMapping } from "../actions/slidderInfo";

export interface SlidderContextType {
  selectedSlider: SlidderCategory;
  sliderCategoryData: SliderCategoryDataProps;
  setSelectedSlider: (type: SlidderCategory) => void;
}

export type SliderMappingDataProps = {
  category: string;
  link: string;
  description: string;
  feed1: string;
  feed2: string;
}

type SliderCategoryDataProps = {[key: string]: SliderMappingDataProps }

const SliderContext = createContext<SlidderContextType | undefined>(undefined);

const SliderContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [selectedSlider, setSelectedSlider] = useState<SlidderCategory>()
  const [sliderCategoryData, setSliderCategoryData] = useState<SliderCategoryDataProps>({})

  useEffect(() => {
    fetchSlidderMapping().then(({ data }) => {
      const newData = data.reduce((newObj, obj) => {
        newObj[obj.category] = obj;
        return newObj
      }, {} as SliderCategoryDataProps)
      setSliderCategoryData(newData)
    })
  }, [])

  const value = useMemo(() => ({
    selectedSlider,
    sliderCategoryData,
    setSelectedSlider
  }), [
    selectedSlider,
    sliderCategoryData,
    setSelectedSlider
  ])

  return (
    <SliderContext.Provider value={value}>
      {children}
    </SliderContext.Provider>
  );
};

export default SliderContextProvider;

export const useSliderContext = () => {
  const ctx =  useContext(SliderContext);
  if(!ctx) {
    throw new Error("Something wrnt wring")
  }
  return ctx
};
