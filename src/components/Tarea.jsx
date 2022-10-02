import React from "react";
import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";

const Tarea = ({ tarea }) => {
  const { descripcion, nombre, prioridad, fechaEntrega, _id, estado } = tarea;
  const { handleEditarTarea, handleModalEliminarTarea, completarTarea } =
    useProyectos();

  const admin = useAdmin();

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="text-xl mb-1">{nombre}</p>
        <p className="text-gray-500 uppercase mb-1 text-sm">{descripcion}</p>
        <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
        <p className="mb-1 text-gray-600">Prioridad: {prioridad}</p>
        {estado && (
          <p className="text-sm bg-green-600 uppercase p-2 rounded-lg text-white">Completado por: {tarea.completado.name}</p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-3">
        {admin && (
          <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleEditarTarea(tarea)}
          >
            Editar
          </button>
        )}
        <button
          type="button"
          className={`${
            estado
              ? "bg-sky-500 hover:bg-sky-600"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white font-bold py-2 px-4 rounded`}
          onClick={() => completarTarea(_id)}
        >
          {estado ? "Completa" : "Incompleta"}
        </button>

        {admin && (
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default Tarea;
