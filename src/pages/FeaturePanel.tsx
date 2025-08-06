import React from 'react';
import "./Main.css";

const featureData = [
  {
    title: "Forecast the Future",
    description: [
      <>Forecast potential accident severity — <i>Minor, Serious, or Fatal</i> — using dynamic, real-world inputs like weather, time, and road conditions.</>,
      <>Leverage a highly-tuned machine learning model with <b className="text-yellow-400 font-bold">95.1% predictive accuracy</b>.</>,
      <>Shift from reactive clean-up to a <b className="text-white font-bold">proactive, life-saving strategy</b> by anticipating high-risk scenarios <u>before they happen</u>.</>
    ],
    color: "bg-yellow-500/80 hover:bg-yellow-500",
    gradient: "from-yellow-500/80 to-orange-500/80",
    icon: (
      <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Visualize Risk",
    description: [
        <>Transform millions of data points into a <b className="text-orange-400 font-bold">clear and actionable dashboard</b>.</>,
        <>Instantly pinpoint geographical <b>accident hotspots</b> using a dynamic, interactive<b className="text-yellow-400 font-bold"> GIS heatmap</b>.</>,
        <>Analyze deep historical trends to deploy your resources with <i>surgical precision</i>, saving time, money, and <b className="text-lime-400 font-bold">lives.</b></>
    ],
    color: "bg-orange-500/80 hover:bg-orange-500",
    gradient: "from-orange-500/80 to-red-600/80",
    icon: (
      <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Drive Policy with Data",
    description: [
        <>Move beyond guesswork and <b className="font-bold text-white">measure the <u>true impact</u></b> of your safety initiatives.</>,
        <>Explore insights across over <b className="font-bold text-red-500"> 15 unique visualizations</b>, from <b className="text-yellow-400 font-bold">yearly trends</b> in line charts to <b className="text-pink-400 font-bold">severity breakdowns</b> in interactive pie charts and <b className="text-yellow-400 font-bold">regulatory impacts</b> in detailed scatter plots.</>,
        <>Make smarter, faster policy decisions backed by <i className="text-green-300">undeniable data</i> and with unshakeable confidence.</>
    ],
    color: "bg-red-600/80 hover:bg-red-600",
    gradient: "from-red-600/80 to-purple-600/80",
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  }
];

interface FeaturePanelProps {
  showAllFeatures: boolean;
  activeIndex: number | null;
  toggleAllFeatures: () => void;
  handleFeatureClick: (index: number) => void;
  featurePanelRef: React.RefObject<HTMLDivElement>;
}

export const FeaturePanel: React.FC<FeaturePanelProps> = ({
  showAllFeatures,
  activeIndex,
  toggleAllFeatures,
  handleFeatureClick,
  featurePanelRef
}) => {
  
  const buttonPositions = ['-translate-y-[120%]', 'translate-y-0', 'translate-y-[120%]'];

  const activeFeature = activeIndex !== null ? featureData[activeIndex] : null;

  return (
    <div ref={featurePanelRef} className="fixed right-16 top-1/2 -translate-y-1/2 flex flex-col items-center z-40 animate-fade-in" style={{animationDelay: '1s'}}>

      <div className="h-80 w-24 flex items-center justify-center">
        
        <div className={`discover-button-wrapper transition-all duration-300 left-[-100px] ${showAllFeatures ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}>
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <button onClick={toggleAllFeatures} className="discover-button-video">
              <span>Discover</span>
          </button>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {featureData.map((feature, index) => (
            <div 
              key={index}
              className={`absolute top-0 left-0 transition-all duration-500 ease-in-out ${showAllFeatures ? `${buttonPositions[index]} opacity-100` : 'opacity-0 scale-90 pointer-events-none'}`}
              style={{ transitionDelay: showAllFeatures ? `${index * 100}ms` : `${(2-index) * 100}ms`}}
            >
              <div className="relative flex items-center justify-center">
                <button onClick={() => handleFeatureClick(index)} className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none ${feature.color} ${activeIndex === index ? 'scale-110 ring-4 ring-white/50' : 'scale-100'}`}>
                  {index + 1}
                </button>
              </div>
            </div>
          ))}

          {activeFeature && (
            <div className={`absolute top-[-28px] -translate-y-1/2 right-full mr-6 w-[420px] p-px rounded-xl bg-gradient-to-br ${activeFeature.gradient} shadow-2xl animate-popup-fade`}>
              <div className="relative bg-black/80 backdrop-blur-md rounded-[11px] p-6 h-full w-full">
                <button onClick={() => handleFeatureClick(activeIndex as number)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {activeFeature.icon}
                    <h3 className="text-xl font-bold text-white [font-family:'High_Tower_Text-Regular',Helvetica]">{activeFeature.title}</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-3">
                    {activeFeature.description.map((point, i) => (
                      <li key={i} className="text-white/80 text-base leading-relaxed pl-1 text-justify">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out mt-6 mx-[-2px] ${showAllFeatures ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         <button onClick={toggleAllFeatures} className="collapse-button">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            Collapse
         </button>
      </div>
    </div>
  );
};