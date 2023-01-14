import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { Container } from "@mui/system";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import {
    getDatabase,
    push,
    ref,
    set,
    onValue,
    remove,
} from "firebase/database";

function User() {
    const db = getDatabase();
    const [users, setUsers] = useState([]);
    const [info, setInfo] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirm: "",
    });

    const [err, setErr] = useState({
        name: null,
        username: null,
        email: null,
        password: null,
        confirm: null,
    });

    // Store data to state;
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

    // Read data;
    useEffect(() => {
        const starCountRef = ref(db, "users");
        onValue(starCountRef, (snapshot) => {
            const data = [];
            snapshot.forEach((item) => {
                data.unshift({ ...item.val(), key: item.key });
            });
            setUsers(data);
        });
    }, []);

    // Create data;
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

    const createHandler = () => {
        errorHandler();
        if (formSubmitHandler()) {
            set(push(ref(db, "users")), {
                name: info.name,
                username: info.username,
                email: info.email,
                password: info.password,
            }).then(() => {
                setInfo({
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                    confirm: "",
                });
            });
        }
    };

    // Delete handler;
    const deleteHandler = (id) => {
        remove(ref(db, "users/" + id));
    };

    return (
        <Container>
            <Grid container spacing={2} style={{ marginTop: "150px" }}>
                <Grid xs={6}>
                    <TextField
                        style={{ marginBottom: "15px" }}
                        fullWidth
                        label="Your name"
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
                    <TextField
                        style={{ marginBottom: "15px" }}
                        fullWidth
                        label="User name"
                        variant="outlined"
                        name="username"
                        value={info.username}
                        onChange={onChangeHandler}
                    />
                    {err.username && (
                        <Typography
                            color="red"
                            style={{ marginBottom: "15px" }}>
                            {err.username}
                        </Typography>
                    )}
                    <TextField
                        style={{ marginBottom: "15px" }}
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        type="email"
                        value={info.email}
                        onChange={onChangeHandler}
                    />
                    {err.email && (
                        <Typography
                            color="red"
                            style={{ marginBottom: "15px" }}>
                            {err.email}
                        </Typography>
                    )}
                    <TextField
                        style={{ marginBottom: "15px" }}
                        fullWidth
                        label="Password"
                        variant="outlined"
                        name="password"
                        type="password"
                        value={info.password}
                        onChange={onChangeHandler}
                    />
                    {err.password && (
                        <Typography
                            color="red"
                            style={{ marginBottom: "15px" }}>
                            {err.password}
                        </Typography>
                    )}
                    <TextField
                        style={{ marginBottom: "15px" }}
                        fullWidth
                        label="Confirm password"
                        variant="outlined"
                        name="confirm"
                        type="password"
                        value={info.confirm}
                        onChange={onChangeHandler}
                    />
                    {err.confirm && (
                        <Typography
                            color="red"
                            style={{ marginBottom: "15px" }}>
                            {err.confirm}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        size="small"
                        onClick={createHandler}>
                        Add New User
                    </Button>
                </Grid>
                <Grid xs={6}>
                    <Grid container spacing={2}>
                        {users.map((item) => (
                            <Grid
                                key={item.key}
                                xs={6}
                                style={{ marginBottom: "15px" }}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardContent>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            style={{ marginBottom: "0px" }}
                                            component="div">
                                            {item.name}
                                        </Typography>
                                        <span
                                            style={{
                                                paddingBottom: "15px",
                                                display: "block",
                                            }}>
                                            #{item.username}
                                        </span>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary">
                                            Email: <br /> {item.email}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            size="small">
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                deleteHandler(item.key)
                                            }
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
                </Grid>
            </Grid>
        </Container>
    );
}

export default User;
