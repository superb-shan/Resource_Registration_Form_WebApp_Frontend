import React, { useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import { UserContext } from '../../Context/User.Context';
import { useContext } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../../Context/Login.Context';
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import ReactLoading from 'react-loading';
import GuestHouseInputField from './GuestHouseInputField';
import { GuestHouseContext } from '../../Context/GuestHouse.Context';


function GuestHouseContainer() {

  const [postStatus, setPostStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedView } = useContext(UserContext)

  useEffect(() => { console.log(postStatus, "useEffect") }, [postStatus, setPostStatus])

  function isNotEmpty(value) {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === "string") {
      return value.trim() !== "";
    }

    if (typeof value === "object" && value instanceof Date) {
      return !isNaN(value.getTime());
    }

    return true;
  }

  function areAllFieldsNotEmpty(fields) {
    for (const field of fields) {
      if (!isNotEmpty(field)) {
        return false;
      }
    }
    return true;
  }

  const { userName } = useContext(LoginContext);

  const {
        name, 
        guestName, 
        contactNumber, 
        designationDepartment, 
        purpose, 
        startDateTime, 
        endDateTime, 
        noOfGuests, 
        foodRequired, 
        menuRequired, 
        paymentDoneBy,
        specialRequirements, 
        requiredRoom,
        isGuestHouseAvailabilityChecked,
        isGuestHouseAvailabilityLoading,
        setIsGuestHouseAvailabilityLoading,
        handleGuestRoomCheckAvailability
  } = useContext(GuestHouseContext);


  //Check for availability of halls when this component is rendered
  // if(startDateTime && endDateTime){
  //   handleGuestRoomCheckAvailability();
  // }

  const fieldsToCheckForValidation = [
        name, 
        guestName, 
        contactNumber, 
        designationDepartment, 
        purpose, 
        startDateTime, 
        endDateTime, 
        noOfGuests, 
        foodRequired, 
        menuRequired, 
        paymentDoneBy, 
        requiredRoom,
  ];


  const handleSubmit = async () => {

    setIsGuestHouseAvailabilityLoading(true);
    const allFieldsNotEmpty = areAllFieldsNotEmpty(fieldsToCheckForValidation);
    if (!allFieldsNotEmpty){ 
      toast.warning('Fill all the Required fields');
      setIsGuestHouseAvailabilityLoading(false);
      return;
    }
    if(contactNumber.length!='10'){
      toast.error("Enter 10 digit Phone Number");
      setIsGuestHouseAvailabilityLoading(false);
      return;
    }
    if (!isGuestHouseAvailabilityChecked){
      toast.error(`Please check Availability`);
      setIsGuestHouseAvailabilityLoading(false);
      return;
    }

    //Check for unavailability of hall before sending request
    // let arrival = `${startDate.toString()} ${startTime.toString()}`
    // let dept = `${endDate.toString()} ${endTime.toString()}`
   
   
    // const response =await axios.get("/guestHouse/checkAvailablity", { params: { Departure:dept,ArrivialDateTime:arrival } });
    // const recentUnavailableHalls = response.data.overlappingSeminars?.map(seminar => seminar.requiredHall) || [];

    // if (recentUnavailableHalls.includes(requiredHall)){
    //   toast.info(`${requiredHall} is not available for this date and time.`);
    //   setIsLoading(false);
    //   return;
    // }
    // console.log("equip", EquipmentRequired.join(", "));
    //        console.log(name,
    //         contactNumber,
    //         requiredHall,
    //         purpose,
    //         DesignationDepartment,
    //         startDate,
    //         endDate,
    //         startTime,
    //         endTime,
    //         noOfAttendees,
    //         guestName);
    
    //Create booking

    // const formattedDateTime = moment(startDate).format("YYYY-MM-DD") + "T" + moment(startTime.toString()).format("HH:mm:ss");
    const res = await axios.post(`/guesthouse/create`,
    {

      userName,  
      DesignationDepartment: designationDepartment,
      applicantName: name,
      contactNumber,
      name: guestName,
      purpose,
      ArrivialDateTime : moment(startDateTime.toString()).format("YYYY-MM-DD HH:mm:ss"), // Use the appropriate date
      DepartureDateTime: moment(endDateTime.toString()).format("YYYY-MM-DD HH:mm:ss"), // Use the appropriate date
      noOfGuest: 1,
      foodRequired,
      menuRequired, 
      paymentDoneBy, 
      requiredRoom,
      specialRequirements
    }
  );
    // console.log("Response:", res);
    setPostStatus(res.data.message);
    setSelectedView('My Bookings');
    setIsGuestHouseAvailabilityLoading(false);
    if (res.data.message === "true") {
      toast.success("Submitted");
    } else {
      console.log("not created Guest House", postStatus);
      toast.error(postStatus);
    }
  }



  return (
    <div className='flex justify-center flex-col items-center bg-fixed bg-[#1976d2] pt-10'>
      <p style={{ color: "#ffffff", textAlign: "center", fontSize: "2rem" }}> Guest House Booking Form</p>
      <div className='bg-white m-auto my-10 p-10 w-[1000px] [@media(max-width:640px)]:w-[500px] border rounded-2xl flex items-center flex-col shadow-2xl'>
        <GuestHouseInputField  />
        <Button
          variant={"contained"}
          sx={{ marginTop: "2.5rem", display:"flex", gap: 1 }}
          onClick={handleSubmit}
          color={postStatus ? 'success' : 'primary'}
        >
          {isLoading ? <ReactLoading height={"20%"} width={"70%"} /> : postStatus ? <><span>Submitted</span> <DoneIcon /></> : <><span>Submit</span> <SendIcon /></>  }
          </Button>
      </div>
    </div>

  )
}


export default GuestHouseContainer
