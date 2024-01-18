import { Box, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl, handleImageError } from "../../utils/utils";
import { useForm } from "react-hook-form";
import { setAlertIdx } from "../../store/NFTModal";
import toast from "react-hot-toast";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { fetchUserData } from "../../store/UserSlice";

export default function UserNameModal({ open, onClose }) {
  const { userInfo } = useSelector((state) => state.userInfo);

  const dispatch = useDispatch();
  const pubKey = useSelector((state) => state.Temp.pubKey);
  const [profileImage, setProfileImage] = useState("");
  const [userName, setuserName] = useState("");
  const [profileURL, setProfileURL] = useState("");
  const accessToken = useSelector((state) => state.Temp.accessToken);
  const players = useSelector((state) => state.Players.players);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  function handleChange(e) {
    if (isValidFileFormat(e.target.files[0])) {
      setProfileURL(URL.createObjectURL(e.target.files[0]));
      setProfileImage(e.target.files[0]);
    } else {
      e.target.value = "";
      setProfileImage("");
      setProfileURL("");
      alert("upload jpg / jpeg / png file only.");
    }
  }

  const isValidFileFormat = (file) => {
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      return (
        fileExtension === "jpg" ||
        fileExtension === "jpeg" ||
        fileExtension === "png"
      );
    }
    return false;
  };

  const onSubmit = async (e) => {
    try {
      const fd = new FormData();
      if (profileImage !== "") fd.append("profileImage", profileImage);
      let isUserExist = players.some((player) => player.userName === userName);
      if (isUserExist) {
        setError("userName", {
          type: "custom",
          message: "User name is already exist",
        });
        return;
      }
      if (userName !== "") fd.append("userName", userName);
      fd.append("profileUrl", profileURL);
      fd.append("_id", pubKey);
      // const toastId = toast.loading('Loading...');
      dispatch(setAlertIdx({ info: "Saving", open: true, response: "" }));
      const resp = await fetch(`${baseUrl}/player`, {
        method: "POST",
        body: fd,
        headers: {
          Authorization: accessToken,
        },
      });
      const data = await resp.json();
      console.log("saving_player", data);

      if (data.msg === "Successful") {
        dispatch(fetchUserData(pubKey));
        onClose();
        setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false }));
          dispatch(
            setAlertIdx({
              info: "Saved",
              open: true,
              response: "success",
            })
          );
        }, 5000);
        setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "success" }));
        }, 8000);
      } else if (data.msg === "Somthing went wrong") {
        dispatch(setAlertIdx({ info: "Failed", open: true, response: "" }));
        setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
        }, 2000);
      } else if (data.msg === "User name is already exist") {
        setError("userName", {
          type: "custom",
          message: "User name is already exist",
        });
        dispatch(setAlertIdx({ info: "Failed", open: true, response: "" }));
        setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
      dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
      setTimeout(() => {
        dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
      }, 2000);
    }
  };

  useEffect(() => {
    if (userInfo?.userName) {
      setValue("userName", userInfo.userName);
    }
  }, [setValue, userInfo]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      // hideBackdrop={true}
      // onBackdropClick={open}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#1C2438",
          boxShadow: 24,
          borderRadius: "24px",
          width: { xs: "300px", sm: "450px", md: "540px", lg: "540px" },
          overflow: "auto",
          maxHeight: { xs: "90vh", sm: "500px", md: "750px", lg: "750px" },
        }}
        className="focus:outline-none"
      >
        <div className="p-4">
          <div className="flex justify-end">
            {/* <IconButton aria-label="close" size="medium" onClick={onClose}>
                            <CloseIcon sx={{ color: '#6A707F' }} />
                        </IconButton> */}
          </div>

          <div className="flex justify-center mt-5 text-xl font-extrabold text-gray">
            Please set username and profile picture first
          </div>
          <form id="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex mt-4">
              <input
                type="file"
                id="profile"
                name="profile"
                className="block mt-6 text-gray w-fit"
                {...register("profileUrl", {
                  required: "Please Select Profile Image",
                })}
                accept="image/*"
                onChange={handleChange}
              />
              {profileURL && (
                <img
                  src={`${profileURL}`}
                  onError={handleImageError}
                  className="object-cover w-32 h-32 rounded-3xl"
                  alt=""
                />
              )}
            </div>
            {errors.profileUrl && (
              <p className="text-red-dark">{errors.profileUrl.message}</p>
            )}
            {/* {errors.Profile && <p className='ml-6 text-red-dark'>{errors.Profile.message}</p>} */}
            <div className="mt-12">
              <div className="order-last w-full max-w-lg">
                <div className="flex flex-wrap mb-8 -mx-3">
                  <div className="w-full px-3 mb-6 md:w-full md:mb-0">
                    <label
                      className="flex items-center gap-2 mb-4 text-sm font-black tracking-wide text-gray"
                      for="grid-first-name"
                    >
                      Username
                      <div>
                        <InformationCircleIcon className="h-5 w-5 text-opacity-[0.56] text-nouveau-main font-black" />
                      </div>
                    </label>
                    <input
                      className="block w-full bg-transparent p-4 border-[1.5px] border-nouveau-main focus:outline-none border-opacity-20 text-xs tracking-wider font-bold text-opacity-80 placeholder:tracking-wider rounded-lg text-space-gray placeholder:text-space-gray"
                      type="text"
                      placeholder="Enter Username ..."
                      {...register("userName", { required: "Enter user name" })}
                      value={userName}
                      onChange={(e) => setuserName(e.target.value)}
                    />
                  </div>
                  {errors.userName && (
                    <p className="ml-6 text-red-dark">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 my-10">
              <button
                type="button"
                onClick={handleClose}
                className="bg-nouveau-main bg-opacity-[0.16] rounded-lg py-3 px-6 text-nouveau-main uppercase text-sm leading-6 tracking-wide font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-bold leading-6 tracking-wide text-white uppercase rounded-lg bg-chat-tag"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
