import React, { useEffect, useRef } from "react";

export default function Tags({tag}) {

  const color_ref = useRef()

  useEffect(()=>{
    color_ref.current.style.backgroundColor = tag.color;
  }, [tag])

  return (
    <>
      <span>
        <span
          className={`uppercase font-bold text-xs text-white p-1 rounded-[4px] leading-3  mr-[2px]`}
          ref={color_ref}
        >
          {tag.title}
        </span>
      </span>
    </>
  );
}
