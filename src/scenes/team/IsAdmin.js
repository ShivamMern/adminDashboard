import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

const IsAdmin = ({ open, onClose, initialValues, onSubmit, title, roles ,fromDelete=false}) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    role: yup.string().required("Role is required"),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "8px",
          border: "3px solid #3e4396",
          backgroundColor: "#1f2a40",
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap="20px">
                <TextField
                  label="Name"
                  variant="outlined"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="name"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  select
                  label="Role"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.role} // Assumed values.role holds the selected role's id or name
                  name="role"
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                  sx={{ gridColumn: "span 2" }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {" "}
                      {/* Use role.id as value */}
                      {role.role} {/* Display the role name */}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                  Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  Proceed
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default IsAdmin;
