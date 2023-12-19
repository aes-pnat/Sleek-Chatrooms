import React, { useState } from "react";
import { Register } from "./Register";
import { Messenger } from "./Messenger";
import { UserType } from "../types/Types";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export const Main = () => {
  const [user, setUser] = useState<UserType>({
    username: "",
    password: "",
  });
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route
            path="/register"
            element={<Register user={user} setUser={setUser} />}
          />
          <Route
            path="/messenger"
            element={<Messenger user={user} setUser={setUser} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};
