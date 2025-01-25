import React from "react";

const Loader = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <style>
        {`
          .circle {
            fill: none;
            stroke-width: 4;
            stroke-linecap: round;
            transform-origin: center;
            stroke: #193048;
          }
          
          .outer {
            stroke-dasharray: 251;
            stroke-dashoffset: 251;
            opacity: 0.3;
            animation: 
              outerDash 3s cubic-bezier(0.4, 0, 0.2, 1) infinite,
              outerRotate 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          }
          
          .inner {
            stroke-dasharray: 188;
            stroke-dashoffset: 188;
            animation: 
              innerDash 3s cubic-bezier(0.4, 0, 0.2, 1) infinite,
              innerRotate 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          }
          
          @keyframes outerDash {
            0% { stroke-dashoffset: 251; }
            40% { stroke-dashoffset: 0; }
            60% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -251; }
          }
          
          @keyframes innerDash {
            0% { stroke-dashoffset: -188; }
            40% { stroke-dashoffset: 0; }
            60% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 188; }
          }
          
          @keyframes outerRotate {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(180deg); }
            50% { transform: rotate(270deg); }
            75% { transform: rotate(300deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes innerRotate {
            0% { transform: rotate(360deg); }
            25% { transform: rotate(180deg); }
            50% { transform: rotate(90deg); }
            75% { transform: rotate(60deg); }
            100% { transform: rotate(0deg); }
          }
        `}
      </style>
      
      {/* Outer circle */}
      <circle className="circle outer" cx="50" cy="50" r="40" />
      
      {/* Inner circle */}
      <circle className="circle inner" cx="50" cy="50" r="30" />
    </svg>
  );
};

export default Loader;