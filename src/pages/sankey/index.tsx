import React, { useState, useMemo, useRef, useEffect } from "react";
// components
import Settings, { calendarDropdownOptions } from "./settings";
import Sankey from "../../components/charts/sankey";
import ResizeObserver from "resize-observer-polyfill"; // Import the polyfill if necessary
import InfoDiv from "./InfoDiv";  // Import InfoDiv here
import SliderInfoSideBar from "./sliderInfoSideBar";
import Modal from "../../components/modal";
import TextField from "../../components/textField";
// types
import { SankeyData } from "../../config/sankey";
import {
  SliderCategory,
  SankeyCategory,
  SliderSettings,
} from "../../config/sankey";
// data
import {
  sliderDefaultData,
  SliderCategoryInfoMaping,
} from "../../config/sankey";
// utils
import cal from "../../utils/sankey";
import { getSankeyDisplayColor } from "../../utils/global";
// context
import { useSliderContext } from "../../context/SliderContext";
import { useAlertContext } from "../../context/AlertContext";
// actions
import { saveSliderValues, SliderSaveBodyProps } from "../../actions/slider";

export type SliderData = { [key in SliderCategory]?: number };

const Home = () => {
  const [defaultSliderData] = useState<SliderData>(sliderDefaultData);
  const [sliderData, setSlider] = useState<SliderData>(sliderDefaultData);
  const [peRatio, setPeRatio] = useState<number>(70);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { selectedSlider, sliderCategoryData, setSelectedSlider } =
    useSliderContext();
  const { setErrorAlert, setSuccessAlert } = useAlertContext();
  const [selectedQuarter, setSelectedQuarter] = useState(calendarDropdownOptions[0].value);
  const [containerWidth, setContainerWidth] = useState(0);
  const sankeyContainerRef = useRef(null);

  // ResizeObserver logic to track container size
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      setContainerWidth(width);
    });

    if (sankeyContainerRef.current) {
      resizeObserver.observe(sankeyContainerRef.current); // Observe the container
    }

    return () => {
      if (sankeyContainerRef.current) {
        resizeObserver.unobserve(sankeyContainerRef.current);
      }
    };
  }, []);

  const sankeyData = useMemo((): SankeyData => {
    const netProfit = cal.calculateNetProfit(sliderData);
    const sankeyLinks: [any, SankeyCategory, (data: SliderData) => number][] = [
      [
        SankeyCategory.AutoRevenue,
        SankeyCategory.TotalRevenue,
        cal.calculateAutoRevenue,
      ],
      [
        SliderSettings[SliderCategory.EnergyGenerationAndStorageRevenue].label,
        SankeyCategory.TotalRevenue,
        cal.getEnergyGenerationAndStorageRevenue,
      ],
      [
        SliderSettings[SliderCategory.ServicesAndOtherRevenue].label,
        SankeyCategory.TotalRevenue,
        cal.getServicesAndOtherRevenue,
      ],
      [
        SankeyCategory.TotalRevenue,
        SankeyCategory.GrossProfite,
        cal.calculateGrossProfit,
      ],
      [
        SankeyCategory.GrossProfite,
        SankeyCategory.OperationProfit,
        cal.calculateOperationProfit,
      ],
      [
        SankeyCategory.GrossProfite,
        SankeyCategory.OperationExpenses,
        cal.calculateOperationExpenses,
      ],
      [
        SankeyCategory.OperationProfit,
        netProfit >= 0 ? SankeyCategory.NetProfite : SankeyCategory.NetLoss,
        cal.calculateNetProfit,
      ],
      [SankeyCategory.OperationProfit, SankeyCategory.Tax, cal.calculateTax],
      [SankeyCategory.Others, SankeyCategory.NetProfite, cal.calculateOthers],
      [
        SankeyCategory.OperationExpenses,
        SankeyCategory["R&D"],
        cal.calculateRAndD,
      ],
      [
        SankeyCategory.OperationExpenses,
        SankeyCategory["SG&A"],
        cal.calculateSGA,
      ],
      [
        SankeyCategory.OperationExpenses,
        SankeyCategory.OtherOpex,
        cal.calculateOtherOpex,
      ],
      [
        SankeyCategory.TotalRevenue,
        SankeyCategory.CostOfRevenue,
        cal.calculateCostOfRevenue,
      ],
    ];

    const othersLineColor = getSankeyDisplayColor(
      cal.calculateOthers(sliderData),
      SankeyCategory.Others,
    );

    return {
      nodes: [...new Set(sankeyLinks.map((ar) => [ar[1], ar[0]]).flat())].map(
        (key) => {
          return {
            id: key,
            heading: [
              SankeyCategory.AutoRevenue,
              SankeyCategory.NetProfite,
            ].includes(key),
            ...(key === SankeyCategory.Others ? { color: othersLineColor } : {}),
          };
        },
      ),
      links: sankeyLinks.map((link) => {
        const [source, target, fn] = link;
        const value = fn?.(sliderData);
        return { source, target, value: Math.max(value, 0), displayValue: Math.max(value, 0) }; // Clamp negative values
      }),
    };
  }, [sliderData]);

  const eps = useMemo(() => cal.calEPS(sliderData), [sliderData]);

  const onSliderChange = (type: SliderCategory, val: number) => {
    setSlider((prevState) => ({ ...prevState, [type]: val }));
  };

  const onSliderInfoClick = (type: SliderCategory) => {
    setSelectedSlider(type);
  };

  const onSaveHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [reportingQuarter, reportingYear] = selectedQuarter.split(" ");
    const data = {
      chartDetails: {
        userEmail,
        peRatio,
        eps,
        company: "tesla",
        currency: "USD",
        date: Date.now(),
        unit: "BN",
        type: "sankey",
        reportingYear,
        reportingQuarter,
      },
      chartData: sliderData,
    } as SliderSaveBodyProps;

    try {
      await saveSliderValues({ data });
      setSuccessAlert("Data saved successfully.");
    } catch (err) {
      setErrorAlert(`Something went wrong while saving data: ${err}.`);
    } finally {
      setShowSaveModal(false);
    }
  };

  const sideBarData = useMemo(() => {
    if (!selectedSlider) return undefined;
    return sliderCategoryData[SliderCategoryInfoMaping[selectedSlider].category];
  }, [selectedSlider]);

  return (
    <div className="w-full">
      {/* InfoDiv at the top */}
      <InfoDiv
        isExpanded={false}
        eps={eps}
        priceTarget={(eps + 2.04) * peRatio}
        peRatio={peRatio}
        setPeRatio={setPeRatio}
        selectedQuarter={selectedQuarter}
        onExpandClick={() => {}}
        onSaveClick={() => setShowSaveModal(true)}
        onQuarterChange={(val) => setSelectedQuarter(val)}
      />

      <div className="flex h-[87vh] w-full">
        {/* Slider Section taking 30% width */}
        <div className="min-w-[350px] bg-[#1d1f23] block overflow-y-scroll overflow-x-hidden border-2 border-gray-500 z-2 mt-5 ml-10 rounded-lg">
          <Settings
            onChange={onSliderChange}
            defaultSliderData={defaultSliderData}
            sliderData={sliderData}
            eps={eps}
            priceTarget={(eps + 2.04) * peRatio}
            peRatio={peRatio}
            setPeRatio={setPeRatio}
            onSliderInfoClick={onSliderInfoClick}
            onSaveClick={() => setShowSaveModal(true)}
            selectedQuarter={selectedQuarter}
            onQuarterChange={(val) => setSelectedQuarter(val)}
          />
        </div>

        {/* Sankey Section taking 70% width */}
        <div
          ref={sankeyContainerRef}
          className="z-0 h-full"
          style={{ height: '90vh' }} // Adjust the height
        >
          <Sankey
            data={sankeyData}
          />
        </div>
      </div>

      <SliderInfoSideBar
        showSidebar={!!selectedSlider}
        data={sideBarData}
        closeSideBar={() => setSelectedSlider(null)}
      />
    </div>
  );
};

export default Home;
