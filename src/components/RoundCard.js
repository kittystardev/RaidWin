import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { styled } from "@mui/material/styles";
import player_nft from "../assets/images/player_nft.svg";
import winning_nft from "../assets/images/winning_nft.svg";
import eye from "../assets/images/eye.svg";
import cat_nft from "../assets/images/cat_nft.svg";
import { Desktop, Mobile, Tablet } from "./Media";

export default function RoundCard() {
  return (
    <Grid
      item
      lg={4}
      sm={6}
      xs={12}
      md={6}
      xl={3}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Card
        sx={{
          maxWidth: "358px",
          width: "100%",
          backgroundColor: "#1C2438",
          borderRadius: "24px",
        }}
      >
        <div className="flex justify-center relative">
          <img src={cat_nft} />
        </div>
        <CardContent sx={{ p: 3 }}>
          <div>
            <div className="text-center text-gray font-black text-sm leading-6 tracking-wider">
              Roderick Wolfe
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex gap-1.5">
                <img src={winning_nft} />
                <img src={winning_nft} />
                <img src={winning_nft} />
                <img src={winning_nft} />
                <img src={winning_nft} />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-space-gray uppercase text-xs tracking-wider text-opacity-[0.56] font-bold">
                <div>FloorPrice</div>
                <div>ROI</div>
              </div>
              <div className="flex justify-between text-gray text-sm leading-6 font-semibold tracking-wide mt-1">
                <div>40.00 SOL</div>
                <div>600%</div>
              </div>
            </div>
          </div>
        </CardContent>
        <Box
          sx={{
            backgroundColor: " rgba(39, 49, 75, 0.4)",
            backdropFilter: "blur(40px)",
            px: 3,
            py: 2,
            display: "block",
            ml: 0,
          }}
        >
          <div className="flex justify-between">
            <div>
              <div className="text-space-gray font-bold text-xs uppercase text-opacity-[0.64] tracking-wider">
                TOTAL
              </div>
              <div className="text-gray font-black text-2xl tracking-wide mt-1">
                $ 19.75
              </div>
            </div>
            <div className="flex">
              <img src={eye} />
            </div>
          </div>
        </Box>
      </Card>
    </Grid>
  );
}
