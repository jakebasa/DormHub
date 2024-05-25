import React, { useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Spinner from "./spinner/Spinner";
import "./styles.css";

export const getAvailableRoomsCount = (roomData, bookingData) => {
  const selectedRooms = bookingData.map((booking) => booking.room._id);
  const availableRooms = roomData.filter(
    (room) => !selectedRooms.includes(room._id)
  );
  return availableRooms.length;
};

const Rooms = () => {
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowDataToDelete, setRowDataToDelete] = useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getRooms");
      setRoomData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
      alert("Error fetching rooms. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const createData = async (values) => {
    const existingRoomNumber = roomData.find(
      (room) => room.roomNo === values.roomNo
    );
    if (existingRoomNumber) {
      setErrorMessage("Room with the same room number already exists");
      setErrorDialogOpen(true);
      return;
    }

    const existingRoomName = roomData.find(
      (room) => room.roomName === values.roomName
    );
    if (existingRoomName) {
      setErrorMessage("Room with the same name already exists");
      setErrorDialogOpen(true);
      return;
    }

    try {
      await axios.post("http://localhost:5001/addRoom", values);
      getRooms();
    } catch (error) {
      console.error("Error creating room:", error.message);
    }
  };

  const updateData = async (values) => {
    try {
      if (!values._id) {
        throw new Error("Invalid ID: _id is undefined or null");
      }
      await axios.patch(`http://localhost:5001/editRoom/${values._id}`, values);
      getRooms();
    } catch (error) {
      console.error("Error updating data:", error.response || error.message);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/deleteRoom/${id}`);
      getRooms();
    } catch (error) {
      console.error("Error deleting room:", error.message);
    }
  };
  const handleCreateData = async ({ values, table }) => {
    console.log("handleCreateData called with values:", values);
    createData(values);
    table.setCreatingRow(null);
  };

  const handleSaveData = async ({ row, values, table }) => {
    const newValues = { ...values, _id: row.original._id };
    await updateData(newValues);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    setRowDataToDelete(row);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (rowDataToDelete) {
      deleteData(rowDataToDelete.original._id);
      setOpenDeleteModal(false);
    }
  };

  const columns = [
    { accessorKey: "roomNo", header: "Room No." },
    { accessorKey: "roomName", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "ratePerMonth", header: "Rate per Month" },
  ];

  const table = useMaterialReactTable({
    columns,
    data: roomData,
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row._id,
    muiToolbarAlertBannerProps: loading
      ? { color: "error", children: "Error loading data" }
      : undefined,
    muiTableContainerProps: { sx: { minHeight: "500px" } },
    onCreatingRowSave: handleCreateData,
    onEditingRowSave: handleSaveData,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3" className="add-new">
          Add New Room
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3" className="edit-room">
          Edit Room
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#CF910C",
          "&:hover": {
            backgroundColor: "#E0A838",
          },
        }}
        onClick={() => table.setCreatingRow(true)}
      >
        Add New Room
      </Button>
    ),
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <MaterialReactTable table={table} />
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title"> Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this room?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Rooms;
