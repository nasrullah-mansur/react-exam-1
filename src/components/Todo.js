import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import { ToastContainer, toast } from "react-toastify";

import { getDatabase, ref, onValue, remove, update } from "firebase/database";

function Todo() {
    const db = getDatabase();
    const [info, setInfo] = useState({
        task: "",
        name: "",
    });
    const [err, setErr] = useState({
        task: null,
        name: null,
    });

    const [todo, setTodo] = useState([]);

    useEffect(() => {
        const starCountRef = ref(db, "todos");
        onValue(starCountRef, (snapshot) => {
            const data = [];
            snapshot.forEach((item) => {
                data.unshift({ ...item.val(), key: item.key });
            });
            setTodo(data);
        });
    }, []);

    // Modal styling;
    const [open, setOpen] = React.useState(false);
    const [modalFor, setModalFor] = useState("edit");
    const [deleteKey, setDeleteKey] = useState("");
    const handleClose = () => setOpen(false);
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        backgroundColor: "#fff",
        padding: "20px 15px",
        borderRadius: "6px",
    };

    // Edit handler;

    const errorHandler = () => {
        for (const key in info) {
            if (info[key] == "") {
                setErr((prev) => ({
                    ...prev,
                    [key]: `${
                        key.charAt(0).toUpperCase() + key.slice(1)
                    } field is required`,
                }));
            } else {
                setErr((prev) => ({
                    ...prev,
                    [key]: null,
                }));
            }
        }
    };

    const formSubmitHandler = () => {
        return !Object.values(info).includes("");
    };

    // Set data to state;
    const onChangeHandler = (e) => {
        let { name, value } = e.target;
        setInfo((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Error handler on change;
        setErr((prev) => ({
            ...prev,
            [name]: null,
        }));
    };

    // Modal open on edit;
    const editHandler = (item) => {
        setModalFor("edit");
        setInfo(item);
        setOpen(true);
    };

    // Edit data from database;
    const editDataHandler = () => {
        errorHandler();
        if (formSubmitHandler()) {
            update(ref(db, "todos/" + info.key), info).then(() => {
                setOpen(false);
                toast("To do updated successfully", {
                    position: "bottom-left",
                });
            });
        }
    };

    // Delete;
    const deleteHandler = (id) => {
        setDeleteKey(id);
        setOpen(true);
        setModalFor("delete");
    };

    const deleteItemHandler = () => {
        setOpen(false);
        remove(ref(db, "todos/" + deleteKey));
        toast("To do removed successfully", {
            position: "bottom-left",
        });
    };

    return (
        <>
            <Container style={{ marginTop: "100px" }}>
                <Grid container spacing={2}>
                    {todo.map((item) => (
                        <Grid xs={4} key={item.key}>
                            <Card
                                sx={{
                                    minWidth: 275,
                                    marginBottom: "15px",
                                }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {item.task}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {item.name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        onClick={() => editHandler(item)}
                                        variant="contained"
                                        size="small">
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => deleteHandler(item.key)}
                                        variant="contained"
                                        color="error"
                                        size="small">
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <div>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition>
                        <Fade in={open}>
                            {modalFor == "edit" ? (
                                <Box style={modalStyle}>
                                    <Typography
                                        variant="h5"
                                        style={{ marginBottom: "15px" }}>
                                        Update your item
                                    </Typography>
                                    <TextField
                                        style={{
                                            marginBottom: "15px",
                                            marginTop: "15px",
                                        }}
                                        fullWidth
                                        label="Task Name"
                                        variant="outlined"
                                        name="task"
                                        value={info.task}
                                        onChange={onChangeHandler}
                                    />

                                    {err.task && (
                                        <Typography
                                            color="red"
                                            style={{ marginBottom: "15px" }}>
                                            {err.task}
                                        </Typography>
                                    )}
                                    <TextField
                                        style={{ marginBottom: "15px" }}
                                        fullWidth
                                        label="Aslign to"
                                        variant="outlined"
                                        name="name"
                                        value={info.name}
                                        onChange={onChangeHandler}
                                    />
                                    {err.name && (
                                        <Typography
                                            color="red"
                                            style={{ marginBottom: "15px" }}>
                                            {err.name}
                                        </Typography>
                                    )}
                                    <Button
                                        onClick={editDataHandler}
                                        variant="contained"
                                        size="small">
                                        Edit
                                    </Button>
                                </Box>
                            ) : (
                                <Box style={modalStyle}>
                                    <Typography
                                        variant="h5"
                                        style={{
                                            marginBottom: "15px",
                                            textAlign: "center",
                                        }}>
                                        Are you sure?
                                    </Typography>

                                    <div style={{ textAlign: "center" }}>
                                        <Button
                                            onClick={handleClose}
                                            variant="contained"
                                            size="small">
                                            No
                                        </Button>
                                        <Button
                                            onClick={deleteItemHandler}
                                            style={{ marginLeft: "10px" }}
                                            color="error"
                                            variant="contained"
                                            size="small">
                                            Yes
                                        </Button>
                                    </div>
                                </Box>
                            )}
                        </Fade>
                    </Modal>
                </div>
                <ToastContainer />
            </Container>
        </>
    );
}

export default Todo;
