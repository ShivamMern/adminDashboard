import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{
        "& .MuiDialog-paper": {
          borderRadius: "8px",
          border: "3px solid #3e4396",
          backgroundColor: "#1f2a40",
        },
      }}>
      <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
      <DialogContent>
        <Typography variant="body1" textAlign={"center"}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant='contained'>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary" variant='contained'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;