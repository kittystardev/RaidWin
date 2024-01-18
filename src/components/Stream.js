import React, { useEffect, useMemo } from "react";
import StreamCard from "./StreamCard";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPageTitles } from "../store/pageTitleSlice";

export default function Stream() {
  const pageTitles = useSelector((state) => state.pageTitle.entities);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPageTitles());
  }, [dispatch]);

  const pageTitle = useMemo(() => {
    if (location && pageTitles) {
      const page = pageTitles.find(
        (ele) => ele.page === location.pathname.substring(1)
      );
      return page ? page.title : "RaidWin";
    }
    return "RaidWin";
  }, [pageTitles, location]);


  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div>
        <div className="block sm:block md:block lg:flex justify-between">
          <div>
            <div className="font-black text-2xl tracking-wide text-gray">
              Streams
            </div>
            <div className="font-semibold text-sm leading-6 tracking-wide text-space-gray text-opacity-80">
              Are you a connected creator? Check out our{" "}
              <span className="text-chat-tag text-opacity-100 font-bold">
                Partnership Program.
              </span>
            </div>
          </div>

          <div className="flex gap-4 mt-8 sm:mt-8 md:mt-8 lg:mt-0 text-space-gray font-bold text-sm">
            <div>
              <button className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3">
                All
              </button>
            </div>
            <div>
              <button className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3">
                Streams
              </button>
            </div>
            <div>
              <button className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3">
                Videos
              </button>
            </div>
          </div>
        </div>

        <div className="pt-9 grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 max-width-responsive mb-12">
          <StreamCard></StreamCard>
        </div>
      </div>
    </>
  );
}
