import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import RoomCrudTable from "./RoomsCopyTable";
import Spinner from "./spinner/Spinner";

function RoomsCopy() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const crud_url = "http://localhost:5001/getRooms";

  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: "roomNo",
        header: "Room Number",
        muiEditTextFieldProps: {
          // Remove validation for roomNo
          // No error and helper text will be displayed
        },
      },
      {
        accessorKey: "roomName",
        header: "Room Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.roomName,
          helperText: validationErrors?.roomName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              roomName: undefined,
            }),
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.description,
          helperText: validationErrors?.description,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined,
            }),
        },
      },

      {
        accessorKey: "ratePerMonth",
        header: "Rate Per Month",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.ratePerMonth,
          helperText: validationErrors?.ratePerMonth,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ratePerMonth: undefined,
            }),
        },
      },
    ],
    [validationErrors]
  );

  const validateLength = (value, field, lowest) => {
    if (value.length === 0) {
      return `${field} cannot be empty`;
    } else if (value.length < lowest) {
      return `A minimum of ${lowest} Characters is required`;
    } else {
      return "";
    }
  };

  const validateMinNumber = (value, minimum) => {
    return value > minimum;
  };

  function validateData(data) {
    return {
      // Exclude validation for roomNo
      roomNo: "",
      roomName: validateLength(data.roomName, "Room Name", 6),
      description: validateLength(data.description, "Description", 6),
      ratePerMonth: !validateMinNumber(data.ratePerMonth, 0)
        ? "Rate per Month cannot be less than 0"
        : "",
    };
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(crud_url);
      setData(response.data);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <Spinner />
      ) : data.length === 0 ? (
        <p>No Data Found</p>
      ) : (
        <RoomCrudTable
          data={data}
          fetchData={fetchData}
          setValidationErrors={setValidationErrors}
          columns={columns}
          crud_url={crud_url}
          validateData={validateData}
        />
      )}
    </div>
  );
}

export default RoomsCopy;
