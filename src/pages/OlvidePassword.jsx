import React, { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import clientAxios from "../config/clienteAxios";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || email < 6) {
      setAlert({
        msg: "El email es obligatorio",
        error: true,
      });
      return;
    }

    try {
      const { data } = await clientAxios.post(`/usuarios/olvide-password`, {
        email,
      });
      setAlert({
        msg: data.msg,
        error: false,
      });
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
        Recupera el acceso y no pierdas tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alert alerta={alert} />}
      <form
        className="my-10 bg-white shadow rounded-lg p-10 p-10"
        onSubmit={handleSubmit}
      >
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

        <input
          type="submit"
          value="Enviar Instrucciones"
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
          to="registrar"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
      </nav>
    </>
  );
};

export default OlvidePassword;
