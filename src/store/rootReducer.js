import { combineReducers } from "redux";
import IndexReducer from "./NFTModal";
import TempReducer from "./TempSlice";
import PlayersReducer from "./PlayersSlice";
import CollectionReducer from "./collectionSlice";
import PreviousRoundReducer from "./PreviousRoundSlice";
import UserInfoReducer from "./UserSlice";
import TopPlayerReducer from "./topplayer";
import SolanaPrice from "./SolanaPrice";
import PlatformSliceReducer from "./PlatformSlice";
import CollectionReducer1vs1 from "./collectionSlice1vs1";
// import TitleReducer from "./pageTitleSlice";
import pageTitleReducer from "./pageTitleSlice";

export default combineReducers({
  Index: IndexReducer,
  Players: PlayersReducer,
  PreviousRound: PreviousRoundReducer,
  Temp: TempReducer,
  collections: CollectionReducer,
  userInfo: UserInfoReducer,
  topplayer: TopPlayerReducer,
  solanaprice: SolanaPrice,
  platformSlice: PlatformSliceReducer,
  collections1vs1: CollectionReducer1vs1,
  pageTitle: pageTitleReducer,
});
