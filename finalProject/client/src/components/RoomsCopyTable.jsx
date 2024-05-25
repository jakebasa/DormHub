import React, { useState } from "react";
import "./styles.css";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
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

const RoomCrudTable = ({
  data,
  fetchData,
  setValidationErrors,
  columns,
  crud_url,
  validateData,
}) => {
  const [isLoadingDataError, setIsLoadingDataError] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowDataToDelete, setRowDataToDelete] = useState(null);
  const url = "http://localhost:5001/";

  const createData = async (values) => {
    const response = await axios.post(`${url}addRoom`, values);
    fetchData();
  };

  const updateData = async (values) => {
    try {
      if (!values._id) {
        throw new Error("Invalid ID: _id is undefined or null");
      }
      const response = await axios.patch(
        `${url}editRoom/${values._id}`,
        values
      );
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error.response || error.message);
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(`${url}deleteRoom/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCreateData = async ({ values, table }) => {
    const newValidationErrors = validateData(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createData(values);
    table.setCreatingRow(null);
  };

  const handleSaveData = async ({ row, values, table }) => {
    const newValues = { ...values, _id: row.original._id };
    const newValidationErrors = validateData(newValues);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
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

  const table = useMaterialReactTable({
    columns,
    data,
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row._id,
    muiToolbarAlertBannerProps: isLoadingDataError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateData,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveData,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3" className="add-new">
          Add New Data
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
        <DialogTitle variant="h3" className="edit-data">
          Edit Data
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
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Data
      </Button>
    ),
  });

  return (
    <div>
      <MaterialReactTable table={table} />
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this Data?
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

export default RoomCrudTable;
