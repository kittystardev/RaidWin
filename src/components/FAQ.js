import { ArrowLeftIcon } from "@heroicons/react/outline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

export default function FAQ({ title, data }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div>
      <div className="flex cursor-pointer faq_div">
        <Link
          to="/support"
          className="flex items-center gap-2 w-3/4 sm:w-3/4 md:w-1/4 "
        >
          <ArrowLeftIcon className="w-6 h-6" />
          <div className="text-chat-tag tracking-wide text-sm leading-6 font-bold">
            Back to support
          </div>
        </Link>
        <div className="w-full">
          <div className="capitalize text-center sm:text-center md:text-center lg:text-center font-extrabold text-2xl sm:text-2xl md:text-2xl lg:text-6xl leading-[72px] text-gray">
            {title}
          </div>
        </div>
      </div>
      <div className="my-12">
        {data?.map((item, index) => (
          <Accordion
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid rgba(106, 112, 127, 0.32)",
              padding: { xs: "24px", sm: "24px", md: "40px", lg: "40px" },
              mb: 2.5,
            }}
            className="custom-accordian"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#6A707F" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{ p: 0 }}
            >
              <div className="font-black text-xl sm:text-xl md:text-2xl text-gray">
                {item.question}
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <div className="font-semibold text-sm leading-6 tracking-wide text-space-gray">
                {item.answer}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <div className="mt-28 mb-12">
        <div className="text-center font-extrabold text-gray text-4xl mb-4">
          Still have a questions?
        </div>
        <div className="text-center font-black tracking-wide text-space-gray text-sm leading-6">
          If you Cannot find answer to you question in our FAQ, you can always
          <span className="text-chat-tag cursor-pointer">
            {" "}
            <a href="mailto:support@raidwin.com"> Contact Us</a>{" "}
          </span>
          . We will answer to you shortly!
        </div>
      </div>
    </div>
  );
}
