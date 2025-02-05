import React, { useState, useContext } from 'react'
import FormContainer from '../Containers/FormContainer'
import { DateTimeInput, TextInput } from '../Fields/InteractionFields';
import { LoginContext } from '../../Context/Login.Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { UserContext } from '../../Context/User.Context';
import { Button } from '@mui/material';
import { Done, Send } from '@mui/icons-material';
import { DataContext } from '../../Context/Data.Context';
import ReactLoading from 'react-loading';


const TransportForm = () => {

    const [coordinatorName, setCoordinatorName] = useState('');
    const [coordinatorPhoneNumber, setCoordinatorPhoneNumber] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestPhoneNumber, setGuestPhoneNumber] = useState('');
    const [organizingDepartment, setOrganizingDepartment] = useState('');
    const [purposeOfTravel, setPurposeOfTravel] = useState('');
    const [travelDateTime, setTravelDateTime] = useState(null);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [noOfPassengers, setNoOfPassengers] = useState(1);
    const [specialRequirements, setSpecialRequirements] = useState('');
    const [todayDate, setTodayDate] = useState(moment().add(5, 'minutes'));

    const [postStatus, setPostStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {userName} = useContext(LoginContext);
    const {setSelectedView} = useContext(UserContext);
    const { allDepartments } = useContext(DataContext);


    function isNotEmpty(value) {
        if (value === null || value === undefined) {
            return false;
        }
        
        if (typeof value === "string" || Array.isArray(value)) {
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

    const fieldsToCheckForValidation = [
        coordinatorName,
        coordinatorPhoneNumber,
        organizingDepartment,
        purposeOfTravel,
        travelDateTime,
        pickupLocation,
        dropLocation,
        noOfPassengers.toString(),
      ];

    const handleSubmit = async() => {

        const allFieldsNotEmpty = areAllFieldsNotEmpty(fieldsToCheckForValidation);
        if (!allFieldsNotEmpty){
            toast.warning('Fill all the Required fields');
            setIsLoading(false);
            return;
        }
        if(coordinatorPhoneNumber.length!==10 ){
            toast.error("Enter 10 digit Phone Number");
            setIsLoading(false);
            return;
        }
        if(coordinatorName.length <3 || coordinatorName.length>=50){
            toast.error("Name should be greater than three characters")
            setIsLoading(false);
            return;
        }
        if(noOfPassengers<1 || noOfPassengers>6){
            toast.error("Passenger count must between 1 to 6")
            setIsLoading(false);
            return;
        }
        if(travelDateTime.format("DD-MM-YYYY") === moment().format("DD-MM-YYYY")){
            toast.error("cannot book transport for today");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const formattedDateTime = travelDateTime.toString();
        const res = await axios.post(`/transport/create`, 
        {
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
         
            purposeOfTravel,
            organizingDepartment,
            pickupLocation,
            dropLocation,
            travelDateTime: formattedDateTime,
            noOfPassengers: noOfPassengers.toString(),
            specialRequirements,
        }
        );
        setPostStatus(res.data.message);
        setIsLoading(false);
        if(res.data.message==="Transport created successfully"){
            toast.success("Submitted");
        }else{
            toast.error("Please fill the form correctly");
            return;
        }
        setSelectedView('My Bookings');
    };

    

  return (
    <FormContainer title="Transportation Requisition Form">
        <TextInput label="Coordinator Name *"  value={coordinatorName} setValue={setCoordinatorName} />
        <TextInput label="Coordinator Phone Number *" type="number" value={coordinatorPhoneNumber} setValue={setCoordinatorPhoneNumber} />
        <TextInput label="Guest Name(s) " placeholder="Enter all the guests names" value={guestName} setValue={setGuestName} />
        <TextInput label="Guest Phone Number(s) " placeholder="Enter all the guests contact numbers" type="number" value={guestPhoneNumber} setValue={setGuestPhoneNumber}/>
        <TextInput label="Organizing Department *" select={true} value={organizingDepartment} setValue={setOrganizingDepartment} options={allDepartments} />
        <TextInput label="Purpose of Travel *" select={true} value={purposeOfTravel} setValue={setPurposeOfTravel} options={['Events', 'Seminar', 'Chief Guest', 'Placement', 'Session/Lectures', 'Others']} />
        <DateTimeInput label="Booking Date Time" value={todayDate} setValue={setTodayDate} intension="todayField" />
        <DateTimeInput label="Travel Date Time *" value={travelDateTime} setValue={setTravelDateTime} />
        <TextInput label="No. of Passengers *" placeholder="Max passenger count is 6" type="number" value={noOfPassengers} setValue={setNoOfPassengers}/>
        <TextInput label="Pick-up Location *" placeholder="Pick-up Location" value={pickupLocation} setValue={setPickupLocation} />
        <TextInput label="Drop Location *" placeholder="Drop Location" value={dropLocation} setValue={setDropLocation} />
        <TextInput label="Special Requirements" placeholder="Special requirements if any" multiline={true} value={specialRequirements} setValue={setSpecialRequirements}/>    
        <Button variant="contained" disabled={isLoading} onClick={handleSubmit} color={postStatus?'success':'primary'} endIcon={postStatus?<Done />:<Send />}>{isLoading? <ReactLoading width={25} height={25} type="spin" /> : postStatus?"Submitted":"Submit"}</Button>
    </FormContainer>
  )
}

export default TransportForm