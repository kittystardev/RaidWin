import "./App.css";
import SideBar from "./components/Common/SideBar";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./assets/scss/style.scss";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollToTop } from "react-router-scroll-to-top";
import Lottie from "lottie-react";
import animation_optimized from "../src/json/animation_optimized.json";
import { useDispatch, useSelector } from "react-redux";
import { decodePlatformState } from "./utils/utils";
import { setTreasuryPubkey } from "./store/PlatformSlice";
function App() {
  useLockBodyScroll();
  // const sidecar = sidecar(() => import("react-remove-scroll/sidecar"));
  const dataLoaded = useSelector((state) => state.Temp.dataLoaded);

  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async function () {
      const plateFormData = await decodePlatformState();
      dispatch(setTreasuryPubkey(plateFormData.treasury_pubkey));
    })();
  }, []);

  useEffect(() => {
    if (!load && !dataLoaded) {
      setLoad(true);
    }
  }, [dataLoaded]);

  window.addEventListener("scroll", function () {
    // viewport and full window dimensions will change
    console.log("ASDFASDF");
    var viewport_width = window.innerWidth;
  });

  return (
    <BrowserRouter>
      <ScrollToTop />
      {dataLoaded ? (
        <Lottie
          animationData={animation_optimized}
          loop={true}
          className="flex justify-center items-center h-screen w-full lg:w-1/3 mx-auto"
        />
      ) : (
        <></>
      )}
      {/* <Switch> */}
      <SideBar></SideBar>
      {/* </Switch> */}
    </BrowserRouter>
  );
}

function useLockBodyScroll() {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when component unmounts
    return () => (document.body.style.overflow = originalStyle);
  }, []); // Empty array ensures effect is only run on mount and unmount
}

export default App;
