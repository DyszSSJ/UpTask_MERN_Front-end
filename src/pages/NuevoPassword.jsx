import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import clientAxios from "../config/clienteAxios";
import Alert from "../components/Alert";

const NuevoPassword = () => {
  const [tokenValido, setTokenValido] = useState(false);
  const [alert, setAlert] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [passwordModificado, setPasswordModificado] = useState(false);
  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clientAxios(`/usuarios/olvide-password/${token}`);
        setTokenValido(true);
      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    comprobarToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setAlert({
        msg: "El password debe de ser minimo 6 caracteres",
        error: true,
      });
      return;
    }

    try {
      const url = `/usuarios/olvide-password/${token}`;
      const { data } = await clientAxios.post(url, { password: newPassword });
      setAlert({
        msg: data.msg,
        error: false,
      });

      setPasswordModificado(true);
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
        Reestablece tu password y no pierdas acceso a tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alert alerta={alert} />}

      {tokenValido && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10 p-10"
          onSubmit={handleSubmit}
        >
          <div className="my-5 ">
            <label
              htmlFor="password"
              className="uppercase text-gray-600 block text-xl font-bold"
            >
              Nuevo Passoword
            </label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu nuevo password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Guardar nuevo password"
            className="bg-sky-700 mb-5 w-full py-3 text-white font-bold rounded uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}

      {passwordModificado && (
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Inicia Sesión
        </Link>
      )}
    </>
  );
};

export default NuevoPassword;
