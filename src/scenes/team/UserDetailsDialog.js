import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch } from "react-redux";
import { createUser, updateUser } from "../../features/users/userSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import IsAdmin from "./IsAdmin";

const UserDetailsDialog = ({
  open,
  onClose,
  userDetails,
  setIsEdit,
  isEdit,
  getuserData,
  roles,
}) => {
  const {
    id,
    firstName,
    lastName,
    email,
    contact,
    address1,
    address2,
    age,
    role,
    status,
  } = userDetails || {};

  console.log(role, "./././././");

  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    contact: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("required"),
    address1: yup.string().required("required"),
    address2: yup.string().required("required"),
    age: yup
      .number()
      .min(18, "Must be at least 18 years old")
      .max(100, "Must be at most 100 years old")
      .required("required"),
    role: yup.string().required("required"),
  });

  const initialValues = {
    firstName: firstName ?? "",
    lastName: lastName ?? "",
    email: email ?? "",
    contact: contact ?? "",
    address1: address1 ?? "",
    address2: address2 ?? "",
    age: age ?? "",
    role: role ?? "",
    status: status ?? "",
  };
  const isAdminConfiguration = {
    name: "",
    email: "",
    role: "",
  };

  // state to toggle edit mode
  const [openEditModal, setOpenEditModal] = useState(false); // state to manage Edit Modal visibility

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log(values, "handleFormSubmit");
    try {
      // Assuming the values contain 'id' and 'userData' (you may need to adjust depending on your form structure)

      // Dispatch the updateUser action with the 'id' and 'userData' as separate arguments
      const response = await dispatch(updateUser({ id, values }));
      getuserData();
      onClose();
      toast.success("User updated successfully!");
      resetForm();
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const statusOptions = ["Active", "Inactive"];

  const handleEditClick = () => {
    setOpenEditModal(true); // open the edit modal
  };

  const handleEditSubmit = (values) => {
    console.log(values);
  
    // Find the role object for the selected id
    const selectedRole = roles.find((role) => role.id === values.role); // assuming values.role contains the role ID
  
    if (selectedRole) {
      // Check if the user has write permission (write: true)
      if (selectedRole.write) {
        setIsEdit(true); // Enable editing
        setOpenEditModal(false); // Close the edit modal
      } else {
        // User does not have write permission to edit
        toast.error(
          "You don't have rights to edit the profile. Only users with write permission can edit profiles."
        );
        setOpenEditModal(false); // Close the edit modal
      }
    } else {
      toast.error("Role not found");
      setOpenEditModal(false); // Close the edit modal
    }
  };
  

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            border: "3px solid #3e4396",
            backgroundColor: "#1f2a40",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">User Details</Typography>
          <Button
            onClick={handleEditClick}
            color="primary"
            variant="contained"
            disabled={isEdit}
          >
            Edit
          </Button>
        </DialogTitle>
        <DialogContent>
          {userDetails ? (
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={checkoutSchema}
              enableReinitialize
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                resetForm,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={!!touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                      disabled={!isEdit} // Disable if not in edit mode
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={!!touched.lastName && !!errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                      disabled={!isEdit}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      sx={{ gridColumn: "span 4" }}
                      disabled={!isEdit}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Age"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.age}
                      name="age"
                      error={!!touched.age && !!errors.age}
                      helperText={touched.age && errors.age}
                      sx={{
                        gridColumn: "span 2",
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                          {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                      }}
                      disabled={!isEdit}
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
                      disabled={!isEdit}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {" "}
                          {/* Use role.id as value */}
                          {role.role} {/* Display the role name */}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      variant="filled"
                      select
                      label="Status"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.status}
                      name="status"
                      error={!!touched.status && !!errors.status}
                      helperText={touched.status && errors.status}
                      sx={{ gridColumn: "span 2" }}
                      disabled={!isEdit}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status.toLowerCase()}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Contact Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contact}
                      name="contact"
                      error={!!touched.contact && !!errors.contact}
                      helperText={touched.contact && errors.contact}
                      sx={{ gridColumn: "span 4" }}
                      disabled={!isEdit}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Address 1"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address1}
                      name="address1"
                      error={!!touched.address1 && !!errors.address1}
                      helperText={touched.address1 && errors.address1}
                      sx={{ gridColumn: "span 4" }}
                      disabled={!isEdit}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Address 2"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address2}
                      name="address2"
                      error={!!touched.address2 && !!errors.address2}
                      helperText={touched.address2 && errors.address2}
                      sx={{ gridColumn: "span 4" }}
                      disabled={!isEdit}
                    />
                  </Box>
                  <DialogActions>
                    <Button
                      onClick={onClose}
                      color="secondary"
                      variant="contained"
                    >
                      Close
                    </Button>
                    {isEdit && (
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        sx={{ backgroundColor: "#4CAF50" }}
                      >
                        Update
                      </Button>
                    )}
                  </DialogActions>
                </form>
              )}
            </Formik>
          ) : (
            <Typography variant="h6">No user data available</Typography>
          )}
        </DialogContent>
      </Dialog>

      <IsAdmin
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        initialValues={isAdminConfiguration}
        onSubmit={handleEditSubmit}
        roles={roles}
        title="Edit User"
      />
    </>
  );
};

export default UserDetailsDialog;
