import React, { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import clientAxios from "../config/clienteAxios";

const Registrar = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPass, setRepetirPass] = useState("");
  const [alert, setAlert] = useState({});

  const henadleSubmit = async (e) => {
    e.preventDefault();

    if ([nombre, email, password, repetirPass].includes("")) {
      setAlert({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }

    if (password !== repetirPass) {
      setAlert({
        msg: "Los password no son iguales",
        error: true,
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        msg: "Tu password es muy corto, agrega minimo 6 caracteres",
        error: true,
      });
      return;
    }
    setAlert({});

    // Crear el usuario con la API
    try {
      const { data } = await clientAxios.post(`/usuarios`, {
        name: nombre,
        email,
        password,
      });
      setAlert({
        msg: data.msg,
        error: false,
      });

      setNombre("");
      setEmail("");
      setPassword("");
      setRepetirPass("");
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alert;
  return (
    <>
      <h1 className="text-sky-600 font-black text-4xl capitalize">
        Crae tu cuenta y administra tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alert alerta={alert} />}
      <form
        className="my-10 bg-white shadow rounded-lg p-10 p-10"
        onSubmit={henadleSubmit}
      >
        <div className="my-5 ">
          <label
            htmlFor="nombre"
            className="uppercase text-gray-600 block text-sm font-bold"
          >
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="my-5 ">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-sm font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5 ">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-sm font-bold"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="my-5 ">
          <label
            htmlFor="password2"
            className="uppercase text-gray-600 block text-sm font-bold"
          >
            Repetir Password
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Repite tu password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repetirPass}
            onChange={(e) => setRepetirPass(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-sky-700 mb-5 w-full py-3 text-white font-bold rounded uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center text-slate-500 text-sm font-bold uppercase"
          to="/"
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>

        <Link
          className="block text-center text-slate-500 text-sm font-bold uppercase"
          to="/olvide-password"
        >
          Olvide mi password
        </Link>
      </nav>
    </>
  );
};

export default Registrar;
