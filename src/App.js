import { createRoutesFromElements, Route, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Create from "./components/Create";
import Todo from "./components/Todo";
import Layout from "./Layout";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Layout />}>
                <Route index element={<Todo />} />
                <Route path="/create" element={<Create />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
}

export default App;
