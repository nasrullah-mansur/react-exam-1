import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { ToastContainer, toast } from "react-toastify";

import { push, ref, set, getDatabase } from "firebase/database";
import { useState } from "react";

function Create() {
    const db = getDatabase();
    const dbRef = ref(db, "todos");

    const [info, setInfo] = useState({
        task: "",
        name: "",
    });

    const [err, setErr] = useState({
        task: null,
        name: null,
    });

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

    // Create;
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

    // Create into database;
    const addTaskHandler = () => {
        errorHandler();
        if (formSubmitHandler()) {
            set(push(dbRef), {
                task: info.task,
                name: info.name,
            }).then(() => {
                toast("To do added successfully", {
                    position: "bottom-left",
                });
                setInfo({
                    task: "",
                    name: "",
                });
            });
        }
    };

    return (
        <Container style={{ marginTop: "100px" }}>
            <Grid container xs={12}>
                <Grid xs={12}>
                    <TextField
                        style={{ marginBottom: "15px" }}
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
                        variant="contained"
                        size="small"
                        onClick={addTaskHandler}>
                        Add Task
                    </Button>
                </Grid>
            </Grid>

            <ToastContainer />
        </Container>
    );
}

export default Create;
