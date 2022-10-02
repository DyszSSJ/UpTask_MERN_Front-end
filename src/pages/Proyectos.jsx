import React, { useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import PreviewProyectos from "../components/PreviewProyectos";
import Alert from "../components/Alert";

const Proyectos = () => {
  const { proyectos, alerta } = useProyectos();

  const { msg } = alerta;
  return (
    <>
      <h1 className="text-3xl font-black">Proyectos</h1>

      {msg && <Alert alerta={alerta} />}

      <div className="bg-white shadow mt-10 rounded-lg p-3">
        {proyectos.length ? (
          proyectos.map((proyecto) => (
            <PreviewProyectos key={proyecto._id} proyecto={proyecto} />
          ))
        ) : (
          <p className="mt-5 text-center text-gray-600 uppercase p-5">
            😢 No hemos encontrado ningun proyecto
          </p>
        )}
      </div>
    </>
  );
};

export default Proyectos;
