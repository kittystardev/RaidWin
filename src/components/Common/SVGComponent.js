import * as React from "react";
const SVGComponent = (props) => (
  <svg
    width={128}
    height={112}
    xmlSpace="preserve"
    viewBox="0 0 128 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    id="add"
    {...props}
  >
    <style type="text/css">
      {
        " \n.st0{fill: url(#gradient);}\n.st1{fill:#579AFF;\n  transform: translateX(63px) translateY(55px);\n}\n#add .st0{-webkit-transition: .4s;}\n#add:hover .st0{ fill: url(#gradient_hover);cursor: pointer;}\n#add .st1{-webkit-transition: .6s;}\n#add:hover .st1{fill: #ffffff;cursor: pointer;-webkit-transform:translateX(63px) translateY(55px) rotate(90deg)}\n"
      }
    </style>
    <defs>
      <linearGradient id="gradient_hover">
        <stop offset="5%" stopColor="#2500ff" />
        <stop offset="95%" stopColor="#d966ff" />
      </linearGradient>
      <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="#1C2438">
          <animate
            attributeName="stop-color"
            values="#579AFF; #1C2438; #579AFF"
            dur="4s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor="#1C2438">
          <animate
            attributeName="stop-color"
            values="#1C2438; #579AFF; #1C2438"
            dur="4s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>
    <path
      className="st0"
      d="M100.588 103.924C97.7396 108.906 92.4416 111.98 86.7031 111.982L41.2717 111.997C35.5277 111.999 30.2235 108.922 27.374 103.934L4.53633 63.9608C1.72546 59.0408 1.72642 53.0012 4.53886 48.0821L27.4121 8.07619C30.2604 3.09447 35.5584 0.0195876 41.2969 0.0177284L86.7283 0.0030096C92.4723 0.00114865 97.7765 3.07846 100.626 8.06589L123.464 48.0392C126.275 52.9592 126.274 58.9988 123.461 63.9179L100.588 103.924Z"
    />
    <g className="st1">
      <rect x={-11} y={0} width={12} height={2} rx={0} />
      <rect x={0} y={-11} width={2} height={12} rx={0} />
      <rect x={1} y={0} width={12} height={2} rx={0} />
      <rect x={0} y={1} width={2} height={12} rx={0} />
    </g>
  </svg>
);
export default SVGComponent;